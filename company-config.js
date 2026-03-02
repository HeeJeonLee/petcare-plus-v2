/**
 * 회사 정보 설정 (백엔드용)
 * api-server.js와 Vercel API Routes에서 공유
 */

export const COMPANY_INFO = {
  // 기본 정보
  name: '수인AI브릿지',
  businessNumber: '151-09-03201',
  representative: '이희천',
  foundingDate: '2026-02-25',

  // 연락처
  phone: '010-5650-0670',
  email: 'hejunl@hanmail.net',

  // 주소
  address: '경기도 수원시 영통구 동탄원천로1109번길 37, 103층 502호',
  city: '수원시',
  district: '영통구',

  // 웹사이트
  website: 'https://petcare-plus.vercel.app',
  github: 'https://github.com/HeeJeonLee/petcare-plus-v2',

  // 서비스명
  serviceName: 'PetCare+',
  serviceTagline: 'AI 기반 펫보험 비교 플랫폼',
  description: '24시간 무료 AI 상담과 8개 보험사 실시간 비교 서비스',
};

// 이메일 서명 생성
export const generateEmailSignature = () => {
  return `
    <hr style="margin-top: 30px; border: none; border-top: 1px solid #e2e8f0;">
    <div style="margin-top: 20px; font-size: 12px; color: #64748b;">
      <p><strong>${COMPANY_INFO.name}</strong></p>
      <p>📧 이메일: ${COMPANY_INFO.email}</p>
      <p>📱 전화: ${COMPANY_INFO.phone}</p>
      <p>🌐 웹사이트: <a href="${COMPANY_INFO.website}" style="color: #3b82f6; text-decoration: none;">${COMPANY_INFO.website}</a></p>
      <p>📍 주소: ${COMPANY_INFO.address}</p>
      <p>사업자등록번호: ${COMPANY_INFO.businessNumber}</p>
      <p style="margin-top: 15px; color: #94a3b8;">
        이 이메일은 자동으로 생성되었으며, 개인정보 및 금융정보를 포함할 수 있습니다.<br/>
        본 메일이 잘못 수신되었다면 즉시 연락 바랍니다.
      </p>
    </div>
  `;
};
