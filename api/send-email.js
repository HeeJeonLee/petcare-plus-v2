/**
 * Vercel Serverless Function - 이메일 발송
 * 배포: https://petcare-plus.com/api/send-email
 * 로컬: npm run dev:full 실행 후 /api/send-email 호출
 */

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, petType, petAge, message } = req.body;

    // API 키 확인
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY 환경변수 없음');
      return res.status(500).json({
        error: 'RESEND API key not configured',
        message: 'Vercel에 RESEND_API_KEY를 설정하세요.'
      });
    }

    // 이메일 본문 생성
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🐾 PetCare+</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">새로운 상담 신청이 접수되었습니다!</p>
        </div>

        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">📋 신청자 정보</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: bold; width: 30%;">이름</td>
              <td style="padding: 12px 8px; color: #1e293b; font-weight: 600;">${name || '-'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: bold;">연락처</td>
              <td style="padding: 12px 8px; color: #1e293b; font-weight: 600;">
                <a href="tel:${phone}" style="color: #2563eb;">${phone || '-'}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: bold;">이메일</td>
              <td style="padding: 12px 8px; color: #1e293b;">${email || '-'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: bold;">반려동물</td>
              <td style="padding: 12px 8px; color: #1e293b;">${petType || '-'} / ${petAge || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; color: #64748b; font-weight: bold; vertical-align: top;">상담 내용</td>
              <td style="padding: 12px 8px; color: #1e293b;">${message || '(내용 없음)'}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #92400e; font-weight: bold;">
            ⏰ 접수 시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
          </p>
          <p style="margin: 8px 0 0; color: #92400e;">
            📞 24시간 내 연락 권장: <a href="tel:${phone}" style="color: #92400e; font-weight: bold;">${phone}</a>
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
          <p>PetCare+ | 수인AI브릿지 | Claude AI 기반 펫보험 상담</p>
          <p>📧 ${email ? `답변: ${email}` : 'AI 챗봇에서 24시간 상담 가능'}</p>
          <p>사업자등록번호: 151-09-03201 | 수원시 팔달구</p>
        </div>
      </div>
    `;

    const recipientEmail = process.env.PETCARE_ADMIN_EMAIL || 'info@petcare-plus.com';
    const fromEmail = process.env.PETCARE_FROM_EMAIL || 'noreply@petcare-plus.com';

    console.log(`📧 이메일 발송 시도:`);
    console.log(`   수신처: ${recipientEmail}`);
    console.log(`   신청자: ${name} (${phone}, ${email})`);

    // Resend API 호출
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `PetCare+ <${fromEmail}>`,
        to: [recipientEmail],
        cc: email ? [email] : [],
        subject: `[PetCare+] 새 상담 신청 - ${name}님`,
        html: emailHtml,
        replyTo: email || recipientEmail
      })
    });

    const resendData = await response.json();

    if (response.ok) {
      console.log('✅ 이메일 발송 성공:', resendData.id);
      return res.status(200).json({
        success: true,
        id: resendData.id,
        message: '이메일이 발송되었습니다.'
      });
    } else {
      console.error('❌ 이메일 발송 실패:', resendData);
      return res.status(400).json({
        error: resendData.message || '이메일 발송 실패',
        details: resendData
      });
    }

  } catch (error) {
    console.error('❌ 서버 오류:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
