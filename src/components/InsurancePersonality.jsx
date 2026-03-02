import { useState } from 'react';

export default function InsurancePersonality() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: 'savings_vs_coverage',
      question: '💰 저축 vs 보장: 어느 쪽을 더 중시하세요?',
      options: [
        { text: '저축해야 한다 (보험료 최소)', value: -2 },
        { text: '약간 저축', value: -1 },
        { text: '둘 다 중요함', value: 0 },
        { text: '약간 보장', value: 1 },
        { text: '보장이 최고다', value: 2 }
      ]
    },
    {
      id: 'risk_tolerance',
      question: '⚖️ 당신의 위험성향은?',
      options: [
        { text: '보수적 (안전이 최우선)', value: -2 },
        { text: '약간 보수적', value: -1 },
        { text: '중도', value: 0 },
        { text: '약간 공격적', value: 1 },
        { text: '공격적 (수익 추구)', value: 2 }
      ]
    },
    {
      id: 'long_term_planning',
      question: '📅 계획 기간은?',
      options: [
        { text: '단기 (1-2년만 생각)', value: -2 },
        { text: '중기 (3-5년)', value: -1 },
        { text: '장기 (반려동물 평생)', value: 0 },
        { text: '매우 장기 (유산 계획)', value: 1 }
      ]
    },
    {
      id: 'trust_preference',
      question: '🤝 어떤 회사를 믿으세요?',
      options: [
        { text: '큰 회사 (안정성)', value: -1 },
        { text: '평판 있는 회사', value: 0 },
        { text: '혁신적 회사', value: 1 },
        { text: 'AI 추천 (데이터)', value: 2 }
      ]
    },
    {
      id: 'decision_style',
      question: '🎯 결정 스타일은?',
      options: [
        { text: '직관적 (빠른 결정)', value: -2 },
        { text: '약간 직관적', value: -1 },
        { text: '데이터 + 직관 50:50', value: 0 },
        { text: '약간 분석적', value: 1 },
        { text: '완전 분석적 (모든 데이터)', value: 2 }
      ]
    }
  ];

  const personalities = {
    'conservative': {
      name: '🛡️ 안정형 (보수 투자자)',
      score: -6,
      description: '안전과 신뢰를 최우선으로',
      characteristics: [
        '✅ 큰 손실을 피하는 것이 목표',
        '✅ 평판 좋은 업체를 선호',
        '✅ 장기 계획에 충실',
        '✅ 보험료 인상에 민감'
      ],
      recommendedCompanies: [
        {
          name: '메리츠',
          reason: '역사 깊고 신뢰도 높음',
          score: 95
        },
        {
          name: '현대',
          reason: '안정적인 운영, 고객 중심',
          score: 92
        },
        {
          name: '삼성',
          reason: '대기업 신뢰도, 체계적 관리',
          score: 90
        }
      ],
      strategy: '기본 보장만으로도 충분합니다. 무리해서 고액 보장을 선택하지 마세요.',
      budgetAdvice: '월 23,000-25,000원대 권장'
    },
    'balanced': {
      name: '⚖️ 균형형 (안정적 성장 추구)',
      score: -1,
      description: '보험료와 보장의 최적 조합',
      characteristics: [
        '✅ 합리적 수준의 위험 수용',
        '✅ 데이터 기반 선택',
        '✅ 가성비를 중시',
        '✅ 장기 성장 지향'
      ],
      recommendedCompanies: [
        {
          name: '메리츠',
          reason: '가성비 1위, 청구 빠름',
          score: 94
        },
        {
          name: 'DB',
          reason: '가격 대비 보장 훌륭',
          score: 91
        },
        {
          name: '현대',
          reason: '낮은 자기부담금',
          score: 89
        }
      ],
      strategy:
        '기본 보장 + 1-2개 특약(치과/MRI)을 추천합니다. 가성비가 가장 좋습니다.',
      budgetAdvice: '월 25,000-27,000원대 권장'
    },
    'aggressive': {
      name: '🚀 공격형 (최대 보장 추구)',
      score: 4,
      description: '보장을 최우선으로',
      characteristics: [
        '✅ 높은 수준의 보장 원함',
        '✅ 예상치 못한 비용에 대비',
        '✅ MRI/CT 같은 고가 검사 대비',
        '✅ 수술비 최대 보장 중시'
      ],
      recommendedCompanies: [
        {
          name: 'KB',
          reason: '수술비 6천만원, MRI/CT 100%',
          score: 98
        },
        {
          name: '한화',
          reason: '높은 보장한도, 신상품',
          score: 93
        },
        {
          name: '삼성',
          reason: '치과 특화, 고액 치료 대비',
          score: 91
        }
      ],
      strategy: '모든 항목을 최고 수준으로 보장하려면 KB를 추천합니다. 보험료는 높지만 보장은 최고입니다.',
      budgetAdvice: '월 28,000-35,000원대 권장'
    },
    'analytical': {
      name: '📊 분석형 (데이터 기반)',
      score: 10,
      description: '모든 것을 데이터로 검증',
      characteristics: [
        '✅ 시나리오별 비용 계산',
        '✅ 통계 기반 선택',
        '✅ 보험료 vs 보장 ROI 계산',
        '✅ 손익분기점 분석'
      ],
      recommendedCompanies: [
        {
          name: 'DB',
          reason: '가격 성능비 데이터 최고',
          score: 96
        },
        {
          name: 'KB',
          reason: 'MRI/CT ROI 최고',
          score: 94
        },
        {
          name: '메리츠',
          reason: '전반적 성능 균형',
          score: 92
        }
      ],
      strategy:
        '우리의 차트 분석 도구를 활용해 5년/10년 비용을 계산하세요. 데이터 기반 최적 선택을 추천합니다.',
      budgetAdvice: '시나리오 분석 후 결정 권장'
    }
  };

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 결과 계산
      const totalScore = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      let personality;

      if (totalScore <= -5) {
        personality = 'conservative';
      } else if (totalScore <= 2) {
        personality = 'balanced';
      } else if (totalScore <= 7) {
        personality = 'aggressive';
      } else {
        personality = 'analytical';
      }

      setResult({
        personality: personalities[personality],
        score: totalScore,
        allAnswers: newAnswers
      });
    }
  };

  return (
    <section id="insurance-personality" className="py-20 bg-gradient-to-b from-indigo-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
            🧠 AI 분석
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            당신의 보험 성향은?
          </h2>
          <p className="text-xl text-gray-600">
            5가지 질문으로 당신에게 맞는 보험 유형을 찾아보세요
          </p>
        </div>

        {!result && !showQuiz && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              보험 성향 분석으로 최고의 선택을 하세요
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              보험료 vs 보장의 선호도, 위험 성향, 계획 기간 등 5가지를 분석하여<br />
              당신이 정말 필요로 하는 보험 유형을 찾아드립니다.
            </p>
            <button
              onClick={() => setShowQuiz(true)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full font-bold text-lg hover:shadow-lg transition-all"
            >
              🎯 지금 분석해보기 (2분)
            </button>

            {/* 4가지 성향 미리보기 */}
            <div className="mt-12 grid md:grid-cols-2 gap-4">
              {Object.values(personalities).map((p, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-left"
                >
                  <h4 className="font-bold text-gray-900 mb-2">{p.name}</h4>
                  <p className="text-sm text-gray-700">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 퀴즈 */}
        {showQuiz && !result && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* 진행도 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-600">
                  {currentQuestion + 1} / {questions.length}
                </span>
                <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 질문 */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {questions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-gray-700"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>

            {/* 뒤로가기 */}
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="text-gray-600 font-medium hover:text-gray-900"
              >
                ← 이전 질문
              </button>
            )}
          </div>
        )}

        {/* 결과 */}
        {result && (
          <div className="space-y-8">
            {/* 성향 결과 */}
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl text-white p-12 text-center">
              <div className="text-6xl mb-4">
                {result.personality.name.split(' ')[0]}
              </div>
              <h3 className="text-3xl font-bold mb-2">{result.personality.name}</h3>
              <p className="text-lg opacity-90">{result.personality.description}</p>
            </div>

            {/* 특징 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">당신의 특징</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {result.personality.characteristics.map((char, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-lg">{char.split(' ')[0]}</span>
                    <span className="text-gray-700">{char.substring(3)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 추천 보험사 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">🏆 맞춤 추천 보험사</h4>
              <div className="space-y-4">
                {result.personality.recommendedCompanies.map((company, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500"
                  >
                    <span className="text-3xl">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                    <div className="flex-grow">
                      <h5 className="font-bold text-gray-900">{company.name}</h5>
                      <p className="text-sm text-gray-600">{company.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">
                        {company.score}점
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 전략 */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-l-4 border-orange-500">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">💡 추천 전략</h4>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                {result.personality.strategy}
              </p>
              <p className="text-sm text-gray-600">
                💰 {result.personality.budgetAdvice}
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#comparison"
                className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all text-center"
              >
                📊 비교표에서 확인하기
              </a>
              <button
                onClick={() => {
                  setShowQuiz(false);
                  setResult(null);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition-all"
              >
                🔄 다시 분석하기
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
