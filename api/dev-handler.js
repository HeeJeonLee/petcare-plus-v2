// api/dev-handler.js
// Vite 개발 서버용 API 미들웨어
// 로컬 개발 중 /api/* 엔드포인트 처리

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// .env.local 파일에서 환경 변수 로드
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

const envConfig = {};
try {
  const envContent = readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...rest] = trimmedLine.split('=');
      const value = rest.join('=').replace(/^["']|["']$/g, '');
      envConfig[key.trim()] = value;
    }
  });
} catch (error) {
  console.warn('⚠️ .env.local 파일을 읽을 수 없습니다');
}

// process.env에 설정
Object.assign(process.env, envConfig);

export function createHandler() {
  return async (req, res, next) => {
    // /api/send-email 요청 처리
    if (req.url === '/api/send-email' && req.method === 'POST') {
      try {
        let body = '';

        // 요청 본문 수집
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const { name, phone, email, petType, petAge, message } = data;

            const RESEND_API_KEY = process.env.RESEND_API_KEY;

            if (!RESEND_API_KEY) {
              console.error('❌ RESEND_API_KEY 환경변수 없음');
              console.log('📝 현재 환경변수:', Object.keys(process.env).filter(k => k.includes('RESEND') || k.includes('PETCARE')));
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'RESEND API key missing' }));
              return;
            }

            // 이메일 본문
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
            console.log(`   API Key: ${RESEND_API_KEY.substring(0, 10)}...`);

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
              console.log('✅ 이메일 발송 성공');
              console.log('   Message ID:', resendData.id);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, id: resendData.id }));
            } else {
              console.error('❌ 이메일 발송 실패:', resendData);
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: resendData.message || '이메일 발송 실패' }));
            }

          } catch (error) {
            console.error('❌ 요청 처리 오류:', error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '요청 처리 오류' }));
          }
        });
      } catch (error) {
        console.error('❌ 요청 처리 오류:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '요청 처리 오류' }));
      }
    } else {
      next();
    }
  };
}
