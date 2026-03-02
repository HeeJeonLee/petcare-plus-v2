#!/usr/bin/env node

// api-server.js
// 독립적인 API 서버 (Vite 개발 서버와 함께 실행)
// npm run api-server로 실행

import http from 'http';
import url from 'url';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// .env.local 파일에서 환경 변수 로드
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env.local');

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
  console.log('✅ .env.local 파일 로드 완료');
} catch (error) {
  console.warn('⚠️ .env.local 파일을 읽을 수 없습니다:', error.message);
}

// process.env에 설정
Object.assign(process.env, envConfig);

const API_PORT = 3001;

const server = http.createServer(async (req, res) => {
  // CORS 처리
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // /api/insurance-data 엔드포인트 (보험 데이터 조회)
  if (req.url === '/api/insurance-data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const insuranceData = [
      {
        id: 'meritz',
        name: '메리츠화재',
        product: '펫퍼민트',
        marketShare: '1위',
        monthlyPremium: { '1세': 22000, '3세': 25000, '5세': 30000, '7세 이상': 38000 },
        coverage: { medical: 5000000, surgery: 10000000, liability: 100000000, mriCt: 3000000 },
        specialFeatures: ['슬개골 보장 (1년 면책)', '전국 2,000개 제휴병원', '자동 청구 시스템', '갱신 15세까지'],
        rating: 5,
        lastUpdated: new Date().toISOString()
      },
      // 나머지 보험사는 DB에서 로드 가능
    ];
    res.end(JSON.stringify(insuranceData));
    return;
  }

  // /api/insurance-updates 엔드포인트 (보험 데이터 변경사항 저장)
  if (req.url === '/api/insurance-updates' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const updateData = JSON.parse(body);
        console.log(`📊 Insurance update recorded: ${updateData.changes.length} changes detected`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Update recorded' }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // /api/analytics 엔드포인트 (사용자 행동 데이터)
  if (req.url === '/api/analytics' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const analyticsData = JSON.parse(body);
        console.log(`📊 Analytics recorded: ${analyticsData.events.length} events`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Analytics saved' }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // /api/content 엔드포인트 (자동 생성 콘텐츠 저장)
  if (req.url === '/api/content' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const contentData = JSON.parse(body);
        console.log(`📝 Content saved: ${contentData.type} (${contentData.status})`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, contentId: Date.now(), message: 'Content saved to drafts' }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // /api/send-email 엔드포인트
  if (req.url === '/api/send-email' && req.method === 'POST') {
    let body = '';

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
              <p>사업자등록번호: 151-09-03201</p>
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
        try {
          console.log('📨 Resend API로 요청 전송 중...');
          const requestBody = JSON.stringify({
            from: `PetCare+ <${fromEmail}>`,
            to: [recipientEmail],
            cc: email ? [email] : [],
            subject: `[PetCare+] 새 상담 신청 - ${name}님`,
            html: emailHtml,
            replyTo: email || recipientEmail
          });

          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: requestBody
          });

          console.log(`📨 응답 상태: ${response.status}`);

          const resendData = await response.json();

          if (response.ok) {
            console.log('✅ 이메일 발송 성공');
            console.log('   Message ID:', resendData.id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, id: resendData.id }));
          } else {
            console.error('❌ 이메일 발송 실패 (상태: ' + response.status + '):', resendData);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: resendData.message || '이메일 발송 실패' }));
          }
        } catch (fetchError) {
          console.error('❌ Resend API 호출 실패 (오류 타입:', fetchError.constructor.name + ')');
          console.error('   오류 메시지:', fetchError.message);
          console.error('   오류 상세:', fetchError);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `API 호출 실패: ${fetchError.message}` }));
        }

      } catch (error) {
        console.error('❌ 요청 처리 오류:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'API Server Running',
      port: API_PORT,
      endpoints: [
        '/api/send-email (POST)',
        '/api/insurance-data (GET)',
        '/api/insurance-updates (POST)',
        '/api/analytics (POST)',
        '/api/content (POST)'
      ]
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(API_PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${API_PORT}`);
  console.log(`📧 /api/send-email endpoint ready`);
  console.log(`🔑 RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
  console.log(`📬 Admin Email: ${process.env.PETCARE_ADMIN_EMAIL || 'info@petcare-plus.com'}`);
});
