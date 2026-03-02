import { useState } from 'react';

export default function HealthCalculator() {
  const [petInfo, setPetInfo] = useState({
    type: '',
    breed: '',
    age: '',
    weight: ''
  });

  const [healthConditions, setHealthConditions] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [breakdown, setBreakdown] = useState(null);

  const baseCosts = {
    강아지: {
      일반진료: 50000,
      치과: 150000,
      검사비: 100000,
      예방접종: 80000
    },
    고양이: {
      일반진료: 40000,
      치과: 120000,
      검사비: 80000,
      예방접종: 60000
    }
  };

  const ageMultipliers = {
    '1-3': 0.8,
    '4-6': 1.0,
    '7-10': 1.3,
    '11-15': 1.8
  };

  const conditionModifiers = {
    당뇨병: 1.5,
    관절염: 1.4,
    피부질환: 1.3,
    비만: 1.2,
    치과질환: 1.25,
    안질환: 1.15,
    신장질환: 1.6,
    '기타': 1.1
  };

  const handleCalculate = () => {
    if (!petInfo.type || !petInfo.age) {
      alert('반려동물 종류와 나이를 입력해주세요.');
      return;
    }

    const base = baseCosts[petInfo.type];
    const ageMultiplier = ageMultipliers[petInfo.age] || 1.0;

    let conditionMultiplier = 1.0;
    healthConditions.forEach(condition => {
      conditionMultiplier *= conditionModifiers[condition] || 1.0;
    });

    const calculatedBreakdown = {
      일반진료: Math.round(base.일반진료 * ageMultiplier * conditionMultiplier),
      치과: Math.round(base.치과 * ageMultiplier * conditionMultiplier),
      검사비: Math.round(base.검사비 * ageMultiplier),
      예방접종: Math.round(base.예방접종 * ageMultiplier * 0.5)
    };

    const total = Object.values(calculatedBreakdown).reduce((a, b) => a + b, 0);

    setBreakdown(calculatedBreakdown);
    setEstimatedCost(total);

    // 계산 결과 저장
    localStorage.setItem('lastHealthCalculation', JSON.stringify({
      petInfo,
      healthConditions,
      result: {
        total,
        breakdown: calculatedBreakdown,
        timestamp: new Date().toISOString()
      }
    }));
  };

  const toggleCondition = (condition) => {
    setHealthConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const monthlyInsuranceEstimate = estimatedCost ? Math.round(estimatedCost * 0.25) : 0;

  return (
    <section id="health-calculator" className="py-20 bg-gradient-to-b from-green-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-4">

        {/* 헤더 */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            💚 반려동물 건강 관리
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 월 예상 의료비 계산기
          </h2>
          <p className="text-xl text-gray-600">
            반려동물의 정보를 입력하면 월 예상 의료비를 자동 계산해드립니다
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8">

            {/* 입력 영역 */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📋 반려동물 정보</h3>

              {/* 반려동물 종류 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  반려동물 종류 *
                </label>
                <div className="flex gap-4">
                  {['강아지', '고양이'].map(type => (
                    <button
                      key={type}
                      onClick={() => setPetInfo({...petInfo, type})}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                        petInfo.type === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type === '강아지' ? '🐕' : '🐈'} {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 나이대 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  나이대 *
                </label>
                <select
                  value={petInfo.age}
                  onChange={(e) => setPetInfo({...petInfo, age: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">선택해주세요</option>
                  <option value="1-3">1~3세 (어린이 · 건강)</option>
                  <option value="4-6">4~6세 (중년 · 안정기)</option>
                  <option value="7-10">7~10세 (중노년 · 질환 증가)</option>
                  <option value="11-15">11~15세 (노령견 · 고비용)</option>
                </select>
              </div>

              {/* 견종/묘종 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견종/묘종
                </label>
                <input
                  type="text"
                  value={petInfo.breed}
                  onChange={(e) => setPetInfo({...petInfo, breed: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="예) 푸들, 시바견, 페르시안 고양이"
                />
              </div>

              {/* 체중 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  체중 (kg)
                </label>
                <input
                  type="number"
                  value={petInfo.weight}
                  onChange={(e) => setPetInfo({...petInfo, weight: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="예) 5, 10, 15"
                />
              </div>

              {/* 건강 상태 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  건강 상태 (중복 선택 가능)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(conditionModifiers).map(condition => (
                    <button
                      key={condition}
                      onClick={() => toggleCondition(condition)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all text-center ${
                        healthConditions.includes(condition)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              >
                💚 의료비 계산하기
              </button>
            </div>

            {/* 결과 영역 */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💰 계산 결과</h3>

              {estimatedCost ? (
                <>
                  {/* 주요 수치 */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-2">📅 월 예상 의료비</p>
                    <p className="text-4xl font-bold text-green-600 mb-4">
                      ₩{estimatedCost.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 border-t border-green-200 pt-3">
                      💡 <strong>Tip:</strong> 월 보험료는 예상 의료비의 약 25~30% 수준입니다.
                    </p>
                  </div>

                  {/* 보험료 추정 */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">📊 월 보험료 추정</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ₩{monthlyInsuranceEstimate.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      (의료비 기준 약 25% 선 권장)
                    </p>
                  </div>

                  {/* 상세 내역 */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4">📋 의료비 상세 내역</h4>
                    <div className="space-y-3">
                      {Object.entries(breakdown).map(([category, cost]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-gray-700">{category}</span>
                          <span className="font-bold text-gray-900">
                            ₩{cost.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center font-bold text-lg">
                      <span>합계</span>
                      <span className="text-green-600">₩{estimatedCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* 안내 문구 */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-xs text-yellow-800">
                      ⚠️ <strong>주의:</strong> 이 계산은 평균 기준이며, 실제 의료비는 동물병원, 질환, 치료 내용에 따라 크게 달라질 수 있습니다.
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
                  <p className="text-lg">📊</p>
                  <p className="mt-2">왼쪽에서 정보를 입력하고<br />계산 버튼을 눌러주세요</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 보험 비교 섹션 링크 */}
        <div className="mt-12 text-center">
          <a
            href="#comparison"
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-bold text-lg hover:shadow-lg transition-all"
          >
            💚 예상 의료비에 맞는 보험 비교해보기
          </a>
        </div>
      </div>
    </section>
  );
}
