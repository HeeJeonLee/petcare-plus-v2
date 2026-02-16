import { useState } from 'react';

export default function AIRecommendation() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  
  // 질문 응답 상태
  const [answers, setAnswers] = useState({
    // 1단계: 반려동물 정보
    petType: '',
    breed: '',
    age: '',
    gender: '',
    neutered: '',
    
    // 2단계: 건강 상태
    hasDisease: '',
    existingConditions: [],
    geneticRisk: '',
    recentSurgery: '',
    
    // 3단계: 보험 니즈
    concerns: [],
    expectedCost: '',
    monthlyBudget: '',
    
    // 4단계: 라이프스타일
    activityLevel: '',
    indoorOutdoor: '',
    walkFrequency: ''
  });

  // 8개사 보험 데이터
  const insuranceData = {
    meritz: {
      name: "메리츠화재",
      product: "펫퍼민트",
      marketShare: "1위",
      coverageRatio: "90%",
      monthlyPremium: { "1세": 22000, "3세": 25000, "5세": 30000, "7세": 38000 },
      coverage: { medical: "500만원", surgery: "1,000만원", liability: "1억원" },
      specialFeatures: ["슬개골 (1년 면책)", "제휴병원 2,000개", "자동 청구 시스템"],
      deductible: "20%",
      bestFor: ["청구 편의성", "안정성", "브랜드 신뢰"],
      recommendedBreeds: ["전 견종", "소형견"]
    },
    samsung: {
      name: "삼성화재",
      product: "애니펫",
      coverageRatio: "80%",
      monthlyPremium: { "1세": 25000, "3세": 28000, "5세": 33000, "7세": 40000 },
      coverage: { medical: "600만원", surgery: "800만원", liability: "5천만원" },
      specialFeatures: ["치과 특약", "다견 10% 할인", "통합 앱 관리"],
      deductible: "10%",
      bestFor: ["다견 가정", "치과 중시", "앱 편의성"],
      recommendedBreeds: ["다견", "치과 위험 견종"]
    },
    hyundai: {
      name: "현대해상",
      product: "굿앤굿우리펫",
      coverageRatio: "100%",
      monthlyPremium: { "1세": 23000, "3세": 26000, "5세": 31000, "7세": 37000 },
      coverage: { medical: "700만원", surgery: "1,200만원", liability: "1억원" },
      specialFeatures: ["피부 질환 특약", "구강 질환 특약", "가성비 우수"],
      deductible: "10%",
      bestFor: ["가성비", "실속파", "피부/구강"],
      recommendedBreeds: ["중형견", "실속 추구"]
    },
    kb: {
      name: "KB손해보험",
      product: "금쪽같은펫",
      coverageRatio: "90%",
      monthlyPremium: { "1세": 27000, "3세": 30000, "5세": 36000, "7세": 45000 },
      coverage: { medical: "800만원", surgery: "1,500만원", liability: "1억원", mriCt: "업계 최고" },
      specialFeatures: ["MRI/CT 한도 최고", "고액 치료비 대비", "중증 질환 강화"],
      deductible: "20%",
      bestFor: ["고액 치료", "검사비", "대형견"],
      recommendedBreeds: ["대형견", "노령견", "고액 검사 필요"]
    },
    db: {
      name: "DB손해보험",
      product: "프로미라이프 펫블리",
      coverageRatio: "90%",
      maxAge: "만 12세",
      monthlyPremium: { "1세": 21000, "3세": 23000, "5세": 28000, "7세": 35000 },
      coverage: { medical: "600만원", surgery: "900만원", liability: "8천만원" },
      specialFeatures: ["슬개골 탈구 특화", "구강 질환 특화", "행동교정 훈련비", "만 12세까지 가입"],
      deductible: "10%",
      bestFor: ["슬개골", "소형견", "유전 질환"],
      recommendedBreeds: ["말티즈", "포메라니안", "요크셔테리어"]
    },
    hanwha: {
      name: "한화손해보험",
      product: "댕댕이",
      monthlyPremium: { "1세": 20000, "3세": 22000, "5세": 27000, "7세": 33000 },
      coverage: { medical: "500만원", surgery: "800만원", liability: "1억원" },
      specialFeatures: ["실속 있는 보험료", "핵심 보장 위주", "온라인 가입 할인"],
      deductible: "15%",
      bestFor: ["실속파", "예산 중시", "기본 보장"],
      recommendedBreeds: ["예산 제한", "건강한 반려동물"]
    },
    nh: {
      name: "NH농협손해보험",
      product: "지킴이펫",
      specialFeatures: ["배상책임 특화", "장례비용 지원", "농협 조합원 할인"],
      bestFor: ["배상책임 중시", "장례비용"],
      recommendedBreeds: ["배상책임 우려"]
    },
    lotte: {
      name: "롯데/하나손해보험",
      note: "낮은 브랜드 인지도",
      bestFor: ["제한적 추천"]
    }
  };

  // 견종별 위험 질환 데이터베이스
  const breedRisks = {
    "말티즈": ["슬개골탈구", "치과질환", "기관지협착"],
    "포메라니안": ["슬개골탈구", "심장질환", "치과질환"],
    "리트리버": ["고관절이형성", "MRI/CT필요질환", "암"],
    "골든리트리버": ["고관절이형성", "MRI/CT필요질환", "암"],
    "비글": ["디스크", "귀질환", "피부질환"],
    "푸들": ["슬개골탈구", "치과질환", "눈질환"],
    "시츄": ["호흡기질환", "안질환", "피부질환"],
    "요크셔테리어": ["슬개골탈구", "치과질환", "기관지협착"],
    "치와와": ["슬개골탈구", "심장질환", "치과질환"],
    "코카스패니얼": ["귀질환", "안질환", "피부질환"]
  };

  const handleInputChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getAIRecommendation = async () => {
    setLoading(true);
    
    try {
      // AI 분석 프롬프트 생성
      const prompt = `당신은 25년 경력의 펫보험 전문가입니다. 다음 고객 정보를 바탕으로 가장 적합한 보험 3개를 추천해주세요.

고객 정보:
- 반려동물: ${answers.petType === 'dog' ? '강아지' : '고양이'}
- 견종: ${answers.breed}
- 나이: ${answers.age}
- 건강 상태: ${answers.hasDisease === 'yes' ? '질병 있음' : '건강함'}
- 기존 질환: ${answers.existingConditions.join(', ')}
- 걱정되는 질병: ${answers.concerns.join(', ')}
- 월 예산: ${answers.monthlyBudget}

8개 보험사 정보:
${JSON.stringify(insuranceData, null, 2)}

${answers.breed}의 주요 위험 질환: ${breedRisks[answers.breed]?.join(', ') || '일반적인 질환'}

다음 JSON 형식으로 정확히 3개의 보험을 추천해주세요:
{
  "recommendations": [
    {
      "rank": 1,
      "insurance": "보험사명",
      "product": "상품명",
      "reasons": ["이유1", "이유2", "이유3"],
      "monthlyPremium": "월 보험료",
      "coverage": {
        "medical": "진료비",
        "surgery": "수술비"
      },
      "deductible": "자기부담금",
      "warning": "주의사항"
    }
  ]
}`;

      // Claude API 호출
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      const data = await response.json();
      const aiResponse = data.content[0].text;
      
      // JSON 파싱
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setRecommendations(result.recommendations);
      }
    } catch (error) {
      console.error('AI 추천 오류:', error);
      // 폴백: 기본 추천 로직
      generateBasicRecommendation();
    }
    
    setLoading(false);
  };

  const generateBasicRecommendation = () => {
    // AI 실패 시 기본 로직으로 추천
    const recs = [];
    
    // 견종별 추천
    if (answers.breed === '말티즈' || answers.breed === '포메라니안' || answers.breed === '요크셔테리어') {
      recs.push({
        rank: 1,
        insurance: "DB손해보험",
        product: "프로미라이프 펫블리",
        reasons: [
          `${answers.breed}는 슬개골 탈구 위험이 높습니다`,
          "DB는 슬개골 보장에 특화되어 있습니다",
          "치과 질환 특약도 강력합니다"
        ],
        monthlyPremium: "23,000원",
        coverage: { medical: "600만원", surgery: "900만원" },
        deductible: "10%",
        warning: "슬개골은 가입 후 1년 면책기간이 있습니다"
      });
      
      recs.push({
        rank: 2,
        insurance: "메리츠화재",
        product: "펫퍼민트",
        reasons: [
          "업계 점유율 1위로 안정적입니다",
          "전국 2,000개 제휴병원 자동 청구",
          "청구 편의성이 뛰어납니다"
        ],
        monthlyPremium: "25,000원",
        coverage: { medical: "500만원", surgery: "1,000만원" },
        deductible: "20%",
        warning: ""
      });
    } else if (answers.breed.includes('리트리버')) {
      recs.push({
        rank: 1,
        insurance: "KB손해보험",
        product: "금쪽같은펫",
        reasons: [
          "대형견은 MRI/CT 비용이 높습니다",
          "KB는 검사비 한도가 업계 최고입니다",
          "고액 치료비 대비에 최적화되어 있습니다"
        ],
        monthlyPremium: "30,000원",
        coverage: { medical: "800만원", surgery: "1,500만원" },
        deductible: "20%",
        warning: ""
      });
    }
    
    // 가성비 추천
    recs.push({
      rank: recs.length + 1,
      insurance: "현대해상",
      product: "굿앤굿우리펫",
      reasons: [
        "가성비가 가장 우수합니다",
        "100% 보장 비율 (업계 최고)",
        "예산 내 최대 보장을 제공합니다"
      ],
      monthlyPremium: "26,000원",
      coverage: { medical: "700만원", surgery: "1,200만원" },
      deductible: "10%",
      warning: ""
    });
    
    setRecommendations(recs.slice(0, 3));
  };

  const handleConsultation = (insurance) => {
    // 상담 신청 페이지로 이동 (고객 정보 전달)
    const consultData = {
      insurance: insurance.insurance,
      product: insurance.product,
      petInfo: `${answers.breed} ${answers.age}`,
      concerns: answers.concerns.join(', ')
    };
    
    // localStorage에 저장
    localStorage.setItem('consultationRequest', JSON.stringify(consultData));
    
    // 상담 신청 섹션으로 스크롤
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="ai-recommendation" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 AI 맞춤형 보험 추천
          </h2>
          <p className="text-xl text-gray-600">
            반려동물 정보를 입력하시면 AI가 최적의 보험을 추천해드립니다
          </p>
          <div className="mt-6 flex justify-center space-x-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`w-16 h-2 rounded-full ${step >= s ? 'bg-blue-600' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>

        {!recommendations ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            {/* 1단계: 반려동물 정보 */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  🐾 반려동물 정보를 알려주세요
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    반려동물 종류 *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['dog', 'cat'].map(type => (
                      <button
                        key={type}
                        onClick={() => handleInputChange('petType', type)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          answers.petType === type
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <span className="text-2xl">{type === 'dog' ? '🐕' : '🐈'}</span>
                        <p className="mt-2 font-medium">{type === 'dog' ? '강아지' : '고양이'}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    견종/묘종 *
                  </label>
                  <select
                    value={answers.breed}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택하세요</option>
                    {answers.petType === 'dog' ? (
                      <>
                        <option value="말티즈">말티즈</option>
                        <option value="포메라니안">포메라니안</option>
                        <option value="푸들">푸들</option>
                        <option value="시츄">시츄</option>
                        <option value="요크셔테리어">요크셔테리어</option>
                        <option value="치와와">치와와</option>
                        <option value="비글">비글</option>
                        <option value="골든리트리버">골든리트리버</option>
                        <option value="리트리버">리트리버</option>
                        <option value="코카스패니얼">코카스패니얼</option>
                        <option value="기타">기타</option>
                      </>
                    ) : (
                      <>
                        <option value="코리안숏헤어">코리안숏헤어</option>
                        <option value="페르시안">페르시안</option>
                        <option value="러시안블루">러시안블루</option>
                        <option value="스코티시폴드">스코티시폴드</option>
                        <option value="기타">기타</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    나이 *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['0-2세', '3-6세', '7세 이상'].map(age => (
                      <button
                        key={age}
                        onClick={() => handleInputChange('age', age)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          answers.age === age
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <p className="font-medium">{age}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={nextStep}
                    disabled={!answers.petType || !answers.breed || !answers.age}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    다음 단계 →
                  </button>
                </div>
              </div>
            )}

            {/* 2단계: 건강 상태 */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  🏥 건강 상태를 알려주세요
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    현재 질병이 있나요? *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ value: 'no', label: '건강함' }, { value: 'yes', label: '질병 있음' }].map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('hasDisease', option.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          answers.hasDisease === option.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <p className="font-medium">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기존 질환 (중복 선택 가능)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['슬개골', '피부병', '치과', '심장', '호흡기', '없음'].map(condition => (
                      <button
                        key={condition}
                        onClick={() => handleMultiSelect('existingConditions', condition)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          answers.existingConditions.includes(condition)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <p className="text-sm font-medium">{condition}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← 이전
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!answers.hasDisease}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    다음 단계 →
                  </button>
                </div>
              </div>
            )}

            {/* 3단계: 보험 니즈 */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  💰 보험 니즈를 알려주세요
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가장 걱정되는 질병 (중복 선택 가능) *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['슬개골 탈구', '고관절 이형성', '치과 질환', '피부 질환', '암/종양', '심장 질환'].map(concern => (
                      <button
                        key={concern}
                        onClick={() => handleMultiSelect('concerns', concern)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          answers.concerns.includes(concern)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <p className="text-sm font-medium">{concern}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월 보험료 예산 *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['1-2만원', '2-3만원', '3만원 이상'].map(budget => (
                      <button
                        key={budget}
                        onClick={() => handleInputChange('monthlyBudget', budget)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          answers.monthlyBudget === budget
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <p className="font-medium">{budget}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← 이전
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={answers.concerns.length === 0 || !answers.monthlyBudget}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    다음 단계 →
                  </button>
                </div>
              </div>
            )}

            {/* 4단계: 라이프스타일 & AI 분석 */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  🏃 라이프스타일을 알려주세요
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    활동량 *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['높음', '보통', '낮음'].map(level => (
                      <button
                        key={level}
                        onClick={() => handleInputChange('activityLevel', level)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          answers.activityLevel === level
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <p className="font-medium">{level}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    실내/외 활동 *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['실내 위주', '실외 활동 많음'].map(env => (
                      <button
                        key={env}
                        onClick={() => handleInputChange('indoorOutdoor', env)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          answers.indoorOutdoor === env
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <p className="font-medium">{env}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← 이전
                  </button>
                  <button
                    onClick={getAIRecommendation}
                    disabled={!answers.activityLevel || !answers.indoorOutdoor || loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    {loading ? '🤖 AI 분석 중...' : '✨ AI 추천 받기'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* AI 추천 결과 */
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                ✨ AI 맞춤 추천 결과
              </h3>
              <p className="text-lg text-gray-600">
                {answers.breed} {answers.age} 기준 최적의 보험을 추천드립니다
              </p>
            </div>

            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-blue-300 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl">
                        {rec.rank === 1 ? '🥇' : rec.rank === 2 ? '🥈' : '🥉'}
                      </span>
                      <h4 className="text-2xl font-bold text-gray-900">
                        {rec.rank}순위: {rec.insurance}
                      </h4>
                    </div>
                    <p className="text-lg text-gray-600">{rec.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">월 보험료</p>
                    <p className="text-2xl font-bold text-blue-600">{rec.monthlyPremium}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">추천 이유:</h5>
                  <div className="space-y-2">
                    {rec.reasons.map((reason, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✅</span>
                        <p className="text-gray-700">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">진료비 보장</p>
                    <p className="font-semibold text-gray-900">{rec.coverage.medical}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">수술비 보장</p>
                    <p className="font-semibold text-gray-900">{rec.coverage.surgery}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">자기부담금</p>
                    <p className="font-semibold text-gray-900">{rec.deductible}</p>
                  </div>
                </div>

                {rec.warning && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-600">⚠️</span>
                      <p className="text-sm text-yellow-800">{rec.warning}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleConsultation(rec)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
                >
                  이 보험으로 상담 신청하기 →
                </button>
              </div>
            ))}

            <div className="text-center pt-8">
              <button
                onClick={() => {
                  setRecommendations(null);
                  setStep(1);
                  setAnswers({
                    petType: '', breed: '', age: '', gender: '', neutered: '',
                    hasDisease: '', existingConditions: [], geneticRisk: '', recentSurgery: '',
                    concerns: [], expectedCost: '', monthlyBudget: '',
                    activityLevel: '', indoorOutdoor: '', walkFrequency: ''
                  });
                }}
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                🔄 다시 추천받기
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
