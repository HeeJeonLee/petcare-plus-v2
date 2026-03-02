/**
 * 회사 정보 상수
 * 모든 회사 정보를 한곳에서 관리하여 일관성 유지
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

  // 비즈니스 설명
  description: '24시간 무료 AI 상담과 8개 보험사 실시간 비교 서비스',

  // 소셜 미디어 (향후 확장용)
  sns: {
    instagram: null,
    facebook: null,
    twitter: null,
  },
};

// 회사 소개 텍스트
export const COMPANY_DESCRIPTION = {
  ko: `수인AI브릿지는 Claude AI를 활용하여 한국 최초의 AI 기반 펫보험 비교 플랫폼 'PetCare+'를 운영하는 혁신 스타트업입니다.

  2026년 2월 설립된 본 회사는 반려동물 보호자들을 위해 24시간 무료 AI 상담, 8개 보험사 실시간 비교, 주변 동물병원 검색 등
  종합적인 펫보험 서비스를 제공합니다.

  특히 Claude AI와 Vercel을 활용한 서버리스 아키텍처로 비용 효율적인 운영을 실현하며,
  자율진화형 플랫폼을 통해 고객 경험을 지속적으로 개선하고 있습니다.`,
};
