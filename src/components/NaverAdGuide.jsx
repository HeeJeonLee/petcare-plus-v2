import { useState } from 'react';

const AD_KEYWORDS = [
  { keyword: '펫보험', cpc: '800~1,500원', competition: '높음', monthly: '33,000', recommend: true },
  { keyword: '펫보험 비교', cpc: '600~1,200원', competition: '중간', monthly: '12,000', recommend: true },
  { keyword: '강아지 보험', cpc: '500~1,000원', competition: '중간', monthly: '18,000', recommend: true },
  { keyword: '고양이 보험', cpc: '400~800원', competition: '낮음', monthly: '8,000', recommend: true },
  { keyword: '말티즈 보험', cpc: '300~600원', competition: '낮음', monthly: '3,200', recommend: true },
  { keyword: '펫보험 추천', cpc: '700~1,300원', competition: '높음', monthly: '9,500', recommend: true },
  { keyword: '슬개골 보험', cpc: '200~500원', competition: '낮음', monthly: '2,100', recommend: true },
  { keyword: '펫보험 보험료', cpc: '500~900원', competition: '중간', monthly: '6,800', recommend: false },
  { keyword: '반려동물 보험', cpc: '600~1,100원', competition: '중간', monthly: '14,000', recommend: false },
  { keyword: '펫보험 가입', cpc: '800~1,500원', competition: '높음', monthly: '7,200', recommend: false },
];

const SETUP_STEPS = [
  {
    step: 1,
    title: '네이버 광고 가입',
    description: '네이버 검색광고 (searchad.naver.com) 회원가입',
    detail: '사업자등록번호 119-13-49535로 사업자 인증 후 광고주 등록',
    link: 'https://searchad.naver.com'
  },
  {
    step: 2,
    title: '캠페인 만들기',
    description: '검색광고 > 파워링크 캠페인 생성',
    detail: '일일 예산 3,000~5,000원으로 시작 (월 10~15만원)',
    link: null
  },
  {
    step: 3,
    title: '키워드 등록',
    description: '아래 추천 키워드 등록 (CPC 낮은 것부터)',
    detail: '말티즈 보험, 고양이 보험, 슬개골 보험 등 롱테일 키워드 우선',
    link: null
  },
  {
    step: 4,
    title: '광고 문구 작성',
    description: 'petcareplus.kr로 랜딩 URL 설정',
    detail: '제목: "8개사 펫보험 무료 비교 | PetCare+" / 설명: "25년 경력 전문가 무료 상담"',
    link: null
  },
  {
    step: 5,
    title: '전환 추적 설정',
    description: '네이버 프리미엄 로그분석 연동',
    detail: '상담 신청 폼 제출을 전환으로 설정하여 광고 효과 측정',
    link: null
  }
];

export default function NaverAdGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllKeywords, setShowAllKeywords] = useState(false);

  const displayKeywords = showAllKeywords ? AD_KEYWORDS : AD_KEYWORDS.filter(k => k.recommend);

  if (!isOpen) {
    return (
      <section id="naver-ad" className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            📢 네이버 키워드 광고 가이드
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            월 5~10만원으로 펫보험 고객을 petcareplus.kr로 유입시키세요
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-bold mb-1">정확한 타겟팅</h3>
              <p className="text-sm text-gray-500">"펫보험" 검색하는 고객만 타겟</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold mb-1">저렴한 비용</h3>
              <p className="text-sm text-gray-500">클릭당 200~1,500원, 월 5만원부터</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold mb-1">효과 측정 가능</h3>
              <p className="text-sm text-gray-500">클릭수, 상담 전환율 실시간 확인</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-xl transform hover:scale-105"
          >
            📢 광고 설정 가이드 보기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="naver-ad" className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            📢 네이버 키워드 광고 설정 가이드
          </h2>
          <p className="text-xl text-gray-600">
            5단계로 펫보험 검색 광고를 시작하세요
          </p>
        </div>

        {/* 설정 단계 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">설정 단계</h3>
          <div className="space-y-6">
            {SETUP_STEPS.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.detail}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-sm text-orange-600 hover:text-orange-800 font-medium"
                    >
                      바로가기 →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 키워드 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">추천 키워드</h3>
            <button
              onClick={() => setShowAllKeywords(!showAllKeywords)}
              className="text-sm text-orange-600 hover:text-orange-800 font-medium"
            >
              {showAllKeywords ? '추천만 보기' : '전체 보기'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 font-bold text-gray-700">키워드</th>
                  <th className="text-center py-3 px-2 font-bold text-gray-700">월 검색량</th>
                  <th className="text-center py-3 px-2 font-bold text-gray-700">클릭 비용</th>
                  <th className="text-center py-3 px-2 font-bold text-gray-700">경쟁도</th>
                  <th className="text-center py-3 px-2 font-bold text-gray-700">추천</th>
                </tr>
              </thead>
              <tbody>
                {displayKeywords.map((kw) => (
                  <tr key={kw.keyword} className="border-b border-gray-100 hover:bg-orange-50">
                    <td className="py-3 px-2 font-medium text-gray-900">{kw.keyword}</td>
                    <td className="py-3 px-2 text-center text-gray-600">{kw.monthly}</td>
                    <td className="py-3 px-2 text-center text-gray-600">{kw.cpc}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        kw.competition === '낮음' ? 'bg-green-100 text-green-700' :
                        kw.competition === '중간' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {kw.competition}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {kw.recommend ? '⭐' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-orange-800 text-sm font-medium">
              💡 전략: 경쟁도 "낮음" 키워드부터 시작하세요. "말티즈 보험", "슬개골 보험" 등 롱테일 키워드가 비용 대비 효과가 좋습니다.
            </p>
          </div>
        </div>

        {/* 예산 시뮬레이션 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">예산 시뮬레이션</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
              <div className="text-sm text-gray-500 mb-1">소규모</div>
              <div className="text-3xl font-bold text-gray-900">월 5만원</div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>일 예산: 1,700원</p>
                <p>예상 클릭: 50~100회/월</p>
                <p>예상 상담: 2~5건/월</p>
              </div>
            </div>
            <div className="border-2 border-orange-400 rounded-xl p-6 text-center bg-orange-50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                추천
              </div>
              <div className="text-sm text-gray-500 mb-1">적정 규모</div>
              <div className="text-3xl font-bold text-orange-600">월 10만원</div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>일 예산: 3,300원</p>
                <p>예상 클릭: 100~200회/월</p>
                <p>예상 상담: 5~10건/월</p>
              </div>
            </div>
            <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
              <div className="text-sm text-gray-500 mb-1">적극 투자</div>
              <div className="text-3xl font-bold text-gray-900">월 20만원</div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>일 예산: 6,700원</p>
                <p>예상 클릭: 200~400회/월</p>
                <p>예상 상담: 10~20건/월</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            ※ 예상 수치는 업종 평균 기반 추정치이며, 실제 결과는 다를 수 있습니다.
          </p>
        </div>

        {/* 광고 문구 예시 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">광고 문구 예시</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-5 hover:border-orange-300 transition-colors">
              <div className="text-blue-600 font-bold text-lg mb-1">
                8개사 펫보험 무료 비교 | AI 맞춤 추천
              </div>
              <div className="text-green-700 text-sm mb-2">petcareplus.kr</div>
              <div className="text-gray-600 text-sm">
                메리츠, 삼성, 현대, KB 등 주요 8개사 한눈에 비교. 25년 경력 전문가 무료 상담. AI가 우리 아이에게 딱 맞는 보험 추천!
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-5 hover:border-orange-300 transition-colors">
              <div className="text-blue-600 font-bold text-lg mb-1">
                소형견 슬개골 보험 전문 | PetCare+
              </div>
              <div className="text-green-700 text-sm mb-2">petcareplus.kr</div>
              <div className="text-gray-600 text-sm">
                말티즈, 포메라니안 슬개골 탈구 보장 비교. DB, 메리츠 특화 상품 분석. 1년 면책기간 전 빠른 가입 추천!
              </div>
            </div>
          </div>
        </div>

        {/* 접기 */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ▲ 접기
          </button>
        </div>
      </div>
    </section>
  );
}
