import { useState, useEffect } from 'react';

export default function AdvancedFilter({ onFilterChange, insuranceData = [] }) {
  const [filters, setFilters] = useState({
    breed: '',
    healthConditions: [],
    priorityFeature: 'balanced',
    budgetRange: [20000, 50000],
    minimumRenewalAge: 15
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  // 견종 목록 (주요 질환과 함께)
  const breeds = [
    {
      name: '말티즈',
      icon: '🐕',
      mainCondition: '슬개골탈구',
      risk: 'high'
    },
    {
      name: '푸들',
      icon: '🐩',
      mainCondition: '귀염증',
      risk: 'medium'
    },
    {
      name: '비글',
      icon: '🐕‍🦺',
      mainCondition: '비만/귀염증',
      risk: 'high'
    },
    {
      name: '시바견',
      icon: '🐕',
      mainCondition: '피부염',
      risk: 'high'
    },
    {
      name: '요크셔테리어',
      icon: '🐕',
      mainCondition: '슬개골',
      risk: 'medium'
    },
    {
      name: '고양이',
      icon: '🐈',
      mainCondition: '비뇨기질환',
      risk: 'medium'
    },
    {
      name: '기타',
      icon: '🐾',
      mainCondition: '일반',
      risk: 'low'
    }
  ];

  // 건강 상태
  const healthConditionsList = [
    { name: '슬개골탈구', icon: '🦵', severity: 'high', prevalence: '40%' },
    { name: '피부질환', icon: '🔴', severity: 'medium', prevalence: '35%' },
    { name: '치과질환', icon: '🦷', severity: 'medium', prevalence: '30%' },
    { name: '귀염증', icon: '👂', severity: 'medium', prevalence: '35%' },
    { name: '비만', icon: '⭕', severity: 'low', prevalence: '25%' },
    { name: '관절염', icon: '🦴', severity: 'high', prevalence: '20%' },
    { name: '백내장', icon: '👁️', severity: 'medium', prevalence: '15%' },
    { name: '심장질환', icon: '❤️', severity: 'high', prevalence: '10%' }
  ];

  // 우선순위 선택
  const priorityOptions = [
    {
      id: 'balanced',
      label: '⚖️ 균형형',
      description: '보험료 vs 보장 균형',
      emoji: '⚖️'
    },
    {
      id: 'low-cost',
      label: '💰 저비용형',
      description: '월 보험료 최소화',
      emoji: '💰'
    },
    {
      id: 'high-coverage',
      label: '🛡️ 고보장형',
      description: '보장금액 최대화',
      emoji: '🛡️'
    },
    {
      id: 'surgery-focused',
      label: '🏥 수술특화형',
      description: '수술비 우선',
      emoji: '🏥'
    },
    {
      id: 'dental-focus',
      label: '🦷 치과특화형',
      description: '치과 보장 우선',
      emoji: '🦷'
    }
  ];

  // 건강상태 토글
  const toggleHealthCondition = (condition) => {
    setFilters(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };

  // 필터 적용
  useEffect(() => {
    const results = applyFilters();
    setFilteredResults(results);
    onFilterChange(results);
  }, [filters]);

  const applyFilters = () => {
    // 기본 데이터 (없으면 사용)
    const data = insuranceData.length > 0 ? insuranceData : getDefaultInsuranceData();

    return data
      .map(company => {
        let score = 100;

        // 1. 우선순위에 따른 점수 계산
        score += calculatePriorityScore(company);

        // 2. 건강상태 매칭
        score += calculateHealthMatch(company);

        // 3. 예산 매칭
        const monthlyPremium = company.monthlyPremium?.['5'] || 25000;
        if (monthlyPremium >= filters.budgetRange[0] && monthlyPremium <= filters.budgetRange[1]) {
          score += 20;
        } else if (monthlyPremium < filters.budgetRange[0]) {
          score += 10;
        }

        // 4. 갱신 한도
        if (company.renewalLimit >= filters.minimumRenewalAge) {
          score += 15;
        }

        return {
          ...company,
          matchScore: score,
          reasons: getMatchReasons(company)
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const calculatePriorityScore = (company) => {
    const score = 0;

    switch (filters.priorityFeature) {
      case 'low-cost':
        // 보험료 낮을수록 높음 (5세 기준 25,000원을 100으로 정규화)
        const premiumScore = Math.max(0, 100 - (company.monthlyPremium?.['5'] || 25000) / 500);
        return premiumScore;

      case 'high-coverage':
        // 수술비 보장 높을수록 높음
        const surgeryScore = ((company.surgeryLimit || 5000000) / 6000000) * 100;
        return Math.min(surgeryScore, 100);

      case 'surgery-focused':
        // 수술비 + MRI/CT
        const mriScore = company.mriCTCoverage ? 30 : 0;
        return (((company.surgeryLimit || 5000000) / 6000000) * 70) + mriScore;

      case 'dental-focus':
        // 치과 특약 있으면 추가
        return company.dentalCoverage ? 100 : 40;

      case 'balanced':
      default:
        // 균형: 보험료(40%) + 보장(40%) + 평점(20%)
        const balancedCost = 40 - ((company.monthlyPremium?.['5'] || 25000) / 625);
        const balancedCoverage = ((company.surgeryLimit || 5000000) / 6000000) * 40;
        const balancedRating = (company.rating || 4.7) * 4;
        return balancedCost + balancedCoverage + balancedRating;
    }
  };

  const calculateHealthMatch = (company) => {
    let score = 0;

    filters.healthConditions.forEach(condition => {
      // 각 질환에 특화된 보험사 체크
      const specialties = {
        '슬개골탈구': ['DB', 'KB', '메리츠'],
        '피부질환': ['메리츠', '삼성'],
        '치과질환': ['삼성'],
        '귀염증': ['메리츠', '현대'],
        '관절염': ['KB', 'DB'],
        '백내장': ['KB', '메리츠'],
        '심장질환': ['KB', '현대'],
        '비만': ['현대', '메리츠']
      };

      if (specialties[condition]?.includes(company.name)) {
        score += 30;
      } else {
        score += 10;
      }
    });

    return score;
  };

  const getMatchReasons = (company) => {
    const reasons = [];

    // 우선순위
    if (filters.priorityFeature === 'low-cost' && (company.monthlyPremium?.['5'] || 25000) < 25000) {
      reasons.push('💰 저렴한 보험료');
    }

    if (filters.priorityFeature === 'high-coverage' && (company.surgeryLimit || 5000000) >= 5500000) {
      reasons.push('🛡️ 높은 보장금액');
    }

    // 건강상태 특화
    filters.healthConditions.forEach(condition => {
      const specialties = {
        '슬개골탈구': 'DB 슬개골 전문',
        '피부질환': '메리츠 피부 특화',
        '치과질환': '삼성 치과 특화',
        '귀염증': '메리츠 귀 특화'
      };

      if (company.name.includes(specialties[condition]?.split(' ')[0])) {
        reasons.push(`⭐ ${condition} 특화`);
      }
    });

    // 자기부담금
    if ((company.deductible || 20) < 15) {
      reasons.push('✅ 낮은 자기부담금');
    }

    // 평점
    if ((company.rating || 4.7) > 4.8) {
      reasons.push('🏆 높은 평점');
    }

    return reasons.slice(0, 3);
  };

  const getDefaultInsuranceData = () => [
    {
      name: '메리츠',
      monthlyPremium: { '5': 25000 },
      surgeryLimit: 5000000,
      deductible: 20,
      rating: 4.8,
      renewalLimit: 18,
      dentalCoverage: true,
      mriCTCoverage: false
    },
    {
      name: '현대',
      monthlyPremium: { '5': 26000 },
      surgeryLimit: 5000000,
      deductible: 10,
      rating: 4.7,
      renewalLimit: 18,
      dentalCoverage: false,
      mriCTCoverage: false
    },
    {
      name: 'KB',
      monthlyPremium: { '5': 30000 },
      surgeryLimit: 6000000,
      deductible: 20,
      rating: 4.9,
      renewalLimit: 20,
      dentalCoverage: false,
      mriCTCoverage: true
    },
    {
      name: 'DB',
      monthlyPremium: { '5': 23000 },
      surgeryLimit: 4500000,
      deductible: 20,
      rating: 4.6,
      renewalLimit: 15,
      dentalCoverage: false,
      mriCTCoverage: false
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* 기본 필터 */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">🔍 고급 필터링</h3>

        {/* 견종 선택 */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-gray-900 mb-4">
            🐕 반려동물 견종/묘종
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {breeds.map(breed => (
              <button
                key={breed.name}
                onClick={() =>
                  setFilters(prev => ({ ...prev, breed: prev.breed === breed.name ? '' : breed.name }))
                }
                className={`p-4 rounded-lg font-medium transition-all text-center ${
                  filters.breed === breed.name
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">{breed.icon}</div>
                <div className="text-sm">{breed.name}</div>
                {filters.breed === breed.name && (
                  <div className="text-xs mt-1 opacity-90">{breed.mainCondition}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 건강 상태 선택 */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-gray-900 mb-4">
            🏥 건강 상태 (복수 선택 가능)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {healthConditionsList.map(condition => (
              <button
                key={condition.name}
                onClick={() => toggleHealthCondition(condition.name)}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  filters.healthConditions.includes(condition.name)
                    ? 'bg-red-500 text-white ring-2 ring-red-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div>{condition.icon}</div>
                <div>{condition.name}</div>
                {filters.healthConditions.includes(condition.name) && (
                  <div className="text-xs mt-1">발병률: {condition.prevalence}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 우선순위 선택 */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-gray-900 mb-4">
            ⭐ 보험 선택 우선순위
          </label>
          <div className="grid md:grid-cols-5 gap-3">
            {priorityOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setFilters(prev => ({ ...prev, priorityFeature: option.id }))}
                className={`p-4 rounded-lg font-medium transition-all text-center ${
                  filters.priorityFeature === option.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-2">{option.emoji}</div>
                <div className="font-bold text-sm">{option.label}</div>
                <div className="text-xs mt-1 opacity-75">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 고급 필터 토글 */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 font-bold text-sm mb-6 flex items-center gap-2 hover:text-blue-700"
        >
          {showAdvanced ? '▼' : '▶'} 추가 필터
        </button>

        {/* 고급 필터 */}
        {showAdvanced && (
          <div className="bg-blue-50 rounded-lg p-6 space-y-6">
            {/* 예산 범위 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                💰 월 보험료 범위: ₩{filters.budgetRange[0].toLocaleString()} ~
                ₩{filters.budgetRange[1].toLocaleString()}
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="15000"
                  max="50000"
                  step="1000"
                  value={filters.budgetRange[0]}
                  onChange={(e) =>
                    setFilters(prev => ({
                      ...prev,
                      budgetRange: [
                        Math.min(parseInt(e.target.value), filters.budgetRange[1]),
                        filters.budgetRange[1]
                      ]
                    }))
                  }
                  className="flex-1"
                />
                <input
                  type="range"
                  min="15000"
                  max="50000"
                  step="1000"
                  value={filters.budgetRange[1]}
                  onChange={(e) =>
                    setFilters(prev => ({
                      ...prev,
                      budgetRange: [
                        filters.budgetRange[0],
                        Math.max(parseInt(e.target.value), filters.budgetRange[0])
                      ]
                    }))
                  }
                  className="flex-1"
                />
              </div>
            </div>

            {/* 갱신 한도 */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                🎂 최소 갱신 한도: {filters.minimumRenewalAge}세 이상
              </label>
              <input
                type="range"
                min="12"
                max="25"
                value={filters.minimumRenewalAge}
                onChange={(e) =>
                  setFilters(prev => ({ ...prev, minimumRenewalAge: parseInt(e.target.value) }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>12세</span>
                <span>18세</span>
                <span>25세</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 필터 결과 */}
      {filteredResults.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            ✨ 맞춤 추천 (상위 3개)
          </h4>
          <div className="space-y-3">
            {filteredResults.slice(0, 3).map((result, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-4 border-l-4 border-blue-500 flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                    <h5 className="text-lg font-bold text-gray-900">{result.name}</h5>
                  </div>
                  <div className="space-y-1">
                    {result.reasons.map((reason, i) => (
                      <p key={i} className="text-sm text-gray-700">
                        {reason}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{result.matchScore}</div>
                  <div className="text-xs text-gray-600">점수</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
