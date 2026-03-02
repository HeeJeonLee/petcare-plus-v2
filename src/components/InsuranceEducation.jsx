import { useState } from 'react';

export default function InsuranceEducation() {
  const [activeTab, setActiveTab] = useState('glossary');
  const [expandedItem, setExpandedItem] = useState(null);

  const glossary = [
    {
      term: '자기부담금',
      icon: '💰',
      definition: '환자가 직접 내야 하는 비용입니다.',
      details:
        '수술비가 300만원인데 자기부담금이 20%라면, 환자는 60만원을 내고 보험사에서 240만원을 냅니다. 낮을수록 환자 부담이 적습니다.'
    },
    {
      term: '면책기간',
      icon: '⏰',
      definition: '보험 가입 후 처음에는 특정 질병을 보장하지 않는 기간입니다.',
      details:
        '예를 들어 면책기간이 30일이면, 가입 후 30일 동안은 질병으로 발생한 진료비를 청구할 수 없습니다. 사고는 보장됩니다. 각 보험사마다 다르므로 꼭 확인하세요.'
    },
    {
      term: '갱신',
      icon: '🔄',
      definition: '계약이 만료되면 새로 갱신하는 것입니다.',
      details:
        '보험료가 인상될 수 있습니다. 예: 1년 계약이라면 매년 갱신 시 나이가 한 살 더 많아지므로 보험료가 올라갑니다. DB는 갱신 한도가 15세까지, KB는 20세까지입니다.'
    },
    {
      term: '보장한도',
      icon: '📊',
      definition: '보험사가 1년에 최대로 지급하는 금액의 한계입니다.',
      details:
        '예: 보장한도가 1,000만원이면, 1년 동안 청구할 수 있는 최대 금액은 1,000만원입니다. 이를 초과하면 본인이 부담해야 합니다.'
    },
    {
      term: '선택 특약',
      icon: '⭐',
      definition: '기본 보장에 추가로 선택할 수 있는 특별한 보장입니다.',
      details:
        '예: 기본 보장은 일반 진료만 하지만, "치과 특약"을 추가하면 치과 치료도 보장받을 수 있습니다. 특약을 추가하면 보험료가 올라갑니다.'
    },
    {
      term: '갱신 한도 연령',
      icon: '🎂',
      definition: '몇 살까지 보험을 갱신할 수 있는가를 나타냅니다.',
      details:
        '예: 갱신 한도 연령이 15세라면, 15세까지만 보험을 갱신할 수 있고 16세가 되면 갱신할 수 없습니다. 16세 이상일 때는 새로운 보험을 찾아야 합니다. 처음부터 높은 한도를 가진 보험을 고르는 것이 현명합니다!'
    },
    {
      term: '청구 서류',
      icon: '📋',
      definition: '보험금을 받기 위해 제출해야 하는 서류입니다.',
      details:
        '일반적으로 필요한 서류: 진료비 영수증, 진료비 명세서, 진단서 (필요시), 동물병원 도장이 찍힌 서류. 각 보험사마다 다를 수 있으므로 상담해서 확인하세요.'
    },
    {
      term: 'MRI/CT 보장',
      icon: '🏥',
      definition: '고가 검사인 MRI나 CT 촬영 비용을 보장하는 것입니다.',
      details:
        'MRI나 CT는 매우 비싼 검사입니다 (200-500만원대). 이를 100% 보장하는 보험(KB)도 있고, 50%만 보장하는 보험도 있습니다. 정확한 진단이 필요한 견종(대형견)이나 나이 많은 반려동물에게 중요합니다.'
    }
  ];

  const breedGuides = [
    {
      breed: '말티즈',
      icon: '🐕',
      mainDiseases: ['슬개골탈구 (40%)', '치과질환 (30%)', '기관지협착 (20%)'],
      recommendedAge: '1-2세에 가입 추천',
      monthlyBudget: '23,000-25,000원',
      topCompanies: ['DB (슬개골 특화)', 'KB (MRI/CT)', '메리츠 (청구 빠름)'],
      tip: '🎯 슬개골이 가장 큰 문제입니다. 어릴 때 가입할수록 수술 비용을 절약할 수 있어요!'
    },
    {
      breed: '푸들',
      icon: '🐩',
      mainDiseases: ['귀염증 (35%)', '피부질환 (30%)', '치아질환 (25%)'],
      recommendedAge: '1-3세에 가입 추천',
      monthlyBudget: '24,000-26,000원',
      topCompanies: ['메리츠 (전반적 강세)', '현대 (자기부담금 낮음)', 'DB (가성비)'],
      tip: '🎯 규칙적인 미용이 중요합니다. 귀 청소를 자주 해서 귀염증을 예방하세요!'
    },
    {
      breed: '비글',
      icon: '🐕‍🦺',
      mainDiseases: ['귀염증 (40%)', '비만 (30%)', '슬개골 (20%)'],
      recommendedAge: '1세부터 가입 추천',
      monthlyBudget: '25,000-28,000원',
      topCompanies: ['현대 (배상책임 높음)', 'KB (MRI/CT)', '메리츠'],
      tip: '🎯 활동적인 견종입니다. 운동량 확보와 체중 관리가 중요해요!'
    },
    {
      breed: '시바견',
      icon: '🐕',
      mainDiseases: ['아토피성 피부염 (45%)', '슬개골 (20%)', '백내장 (15%)'],
      recommendedAge: '2세 이전에 가입 추천',
      monthlyBudget: '26,000-30,000원',
      topCompanies: ['삼성 (치과 특화)', 'KB (고액 치료 대비)', '메리츠'],
      tip: '🎯 피부 관리가 매우 중요합니다. 정기적인 피부과 진료를 받아보세요!'
    },
    {
      breed: '고양이',
      icon: '🐈',
      mainDiseases: ['비뇨기질환 (35%)', '치과질환 (30%)', '소화기질환 (20%)'],
      recommendedAge: '1-3세에 가입 추천',
      monthlyBudget: '20,000-24,000원',
      topCompanies: ['메리츠 (고양이 맞춤)', '현대 (자기부담금 낮음)', 'DB (가성비)'],
      tip: '🎯 물 섭취가 중요합니다. 고양이가 충분한 물을 마시도록 유도해주세요!'
    }
  ];

  const claimProcess = [
    {
      step: '1단계',
      title: '동물병원 방문 및 진료',
      duration: '예약 및 진료',
      details: '수의사의 진단을 받고 치료받습니다. 이때 영수증과 명세서를 꼭 받아두세요!',
      checklist: ['✅ 영수증 받기', '✅ 명세서 받기', '✅ 진단서 요청하기 (필요시)']
    },
    {
      step: '2단계',
      title: '보험사 연락',
      duration: '진료 후 1일 이내',
      details: '보험사에 청구하겠다는 의사를 전달합니다. 각 보험사 고객센터로 전화하세요.',
      checklist: [
        '✅ 보험가입번호 준비하기',
        '✅ 진료 내용 설명하기',
        '✅ 필요한 서류 확인하기'
      ]
    },
    {
      step: '3단계',
      title: '서류 준비 및 제출',
      duration: '3-5일',
      details: '보험사가 요청한 서류를 모아서 제출합니다. (이메일, 앱, 우편)',
      checklist: ['✅ 진료비 영수증', '✅ 진료비 명세서', '✅ 진단서 (필요시)', '✅ 신분증 사본']
    },
    {
      step: '4단계',
      title: '보험사 심사',
      duration: '3-7일',
      details: '보험사가 제출하신 서류를 검토하고 보험금 지급 여부를 결정합니다.',
      checklist: ['✅ 심사 기간: 평균 3-5일', '✅ 복잡한 사건은 7일까지 가능']
    },
    {
      step: '5단계',
      title: '보험금 지급',
      duration: '1-2일',
      details: '심사 완료 후 승인되면 고객님 계좌로 보험금이 입금됩니다.',
      checklist: [
        '✅ 보험금 입금 확인',
        '✅ 입금액 확인 (자기부담금 제외)',
        '✅ 영수증 보관'
      ]
    }
  ];

  const faq = [
    {
      q: '가입 후 며칠 뒤부터 보장을 받을 수 있나요?',
      a: '보험마다 다릅니다. 대부분 가입 후 30-90일의 "면책기간"이 있습니다. 이 기간에는 특정 질병(예: 슬개골)을 보장하지 않습니다. 하지만 사고는 즉시 보장합니다.'
    },
    {
      q: '나이가 많으면 보험료가 훨씬 비싼가요?',
      a: '맞습니다. 8세부터 보험료가 크게 올라갑니다. 예: 메리츠는 5세 25,000원 → 7세 32,000원입니다. 반려동물이 어릴 때 가입할수록 이득입니다!'
    },
    {
      q: '이미 있는 질병도 보장받을 수 있나요?',
      a: '아니요. 이미 있는 질병은 "사전질환"으로 분류되어 보장하지 않습니다. 예: 이미 슬개골 수술을 받았으면, 그것과 관련된 비용은 보험료를 내도 받을 수 없습니다.'
    },
    {
      q: '보험료를 안 내면 어떻게 되나요?',
      a: '보험료를 내지 않으면 계약이 해지됩니다. 30일 이상 미납하면 자동 해지되고, 다시 가입할 때는 새로운 면책기간이 생깁니다.'
    },
    {
      q: '2개 보험사에 동시에 가입할 수 있나요?',
      a: '네, 가능합니다! 일부 보험사는 중복가입을 허용합니다. 예: 메리츠(일반 진료) + KB(수술, MRI/CT)를 조합하면 보장을 넓힐 수 있습니다. 다만 보험료가 두 배가 됩니다.'
    },
    {
      q: '보험료가 계속 올라간다던데, 얼마나 올라나요?',
      a: '평균 연 3-5%씩 올라갑니다. 5세에 25,000원이면, 6세에 26,000원, 7세에 27,500원... 이런 식으로 올라갑니다. 나이가 많을수록 인상폭이 커집니다.'
    }
  ];

  const toggleExpand = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <section id="education" className="py-20 bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            📚 교육 센터
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            펫보험 완벽 가이드
          </h2>
          <p className="text-xl text-gray-600">
            펫보험 처음이세요? 모든 것을 알려드립니다
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8 flex flex-wrap gap-2 md:gap-0 md:flex-nowrap">
          {[
            { id: 'glossary', label: '📖 용어 사전', icon: '📖' },
            { id: 'breeds', label: '🐕 견종/묘종 가이드', icon: '🐕' },
            { id: 'process', label: '📋 청구 절차', icon: '📋' },
            { id: 'faq', label: '❓ 자주 묻는 질문', icon: '❓' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.icon}</span>
            </button>
          ))}
        </div>

        {/* 1. 용어 사전 */}
        {activeTab === 'glossary' && (
          <div className="space-y-4">
            {glossary.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.term}</h3>
                      <p className="text-sm text-gray-600">{item.definition}</p>
                    </div>
                  </div>
                  <span className="text-2xl text-gray-400">
                    {expandedItem === idx ? '▼' : '▶'}
                  </span>
                </button>
                {expandedItem === idx && (
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{item.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 2. 견종/묘종 가이드 */}
        {activeTab === 'breeds' && (
          <div className="grid md:grid-cols-2 gap-6">
            {breedGuides.map((guide, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
                  <h3 className="text-2xl font-bold">
                    {guide.icon} {guide.breed}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-2">주요 질병</p>
                    <div className="space-y-1">
                      {guide.mainDiseases.map((disease, i) => (
                        <p key={i} className="text-sm text-gray-700">
                          • {disease}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">추천 가입 연령</p>
                    <p className="text-sm font-bold text-blue-600">{guide.recommendedAge}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">월 예산 가이드</p>
                    <p className="text-sm font-bold text-green-600">{guide.monthlyBudget}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-2">추천 보험사</p>
                    <div className="space-y-1">
                      {guide.topCompanies.map((company, i) => (
                        <p key={i} className="text-sm text-gray-700">
                          ✓ {company}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">{guide.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. 청구 절차 */}
        {activeTab === 'process' && (
          <div className="space-y-4">
            {claimProcess.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.details}</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-gray-600 mb-2">⏱️ {item.duration}</p>
                      <div className="space-y-2">
                        {item.checklist.map((check, i) => (
                          <p key={i} className="text-sm text-gray-700">
                            {check}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
              <p className="text-lg font-bold text-green-700 mb-2">💚 청구 완료!</p>
              <p className="text-sm text-green-600">
                일반적으로 진료 후 2-3주 내에 보험금을 받게 됩니다.
              </p>
            </div>
          </div>
        )}

        {/* 4. 자주 묻는 질문 */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faq.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <button
                  onClick={() => toggleExpand(idx + glossary.length)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.q}</h3>
                  </div>
                  <span className="text-2xl text-gray-400">
                    {expandedItem === idx + glossary.length ? '▼' : '▶'}
                  </span>
                </button>
                {expandedItem === idx + glossary.length && (
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">더 알고 싶으신 사항이 있으신가요?</p>
        <a
          href="#contact"
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:shadow-lg transition-all"
        >
          💬 AI 챗봇에게 문의하기
        </a>
      </div>
    </section>
  );
}
