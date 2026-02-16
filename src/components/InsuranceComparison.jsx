import { useState } from 'react';

export default function InsuranceComparison() {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [sortBy, setSortBy] = useState('premium'); // premium, coverage, rating
  const [filterBreed, setFilterBreed] = useState('');
  const [filterAge, setFilterAge] = useState('3세');
  const [filterBudget, setFilterBudget] = useState('all');

  // 8개사 완전한 데이터
  const insuranceCompanies = [
    {
      id: 'meritz',
      name: '메리츠화재',
      product: '펫퍼민트',
      logo: '🛡️',
      marketShare: '1위',
      coverageRatio: 90,
      maxAge: 10,
      monthlyPremium: { '1세': 22000, '3세': 25000, '5세': 30000, '7세 이상': 38000 },
      coverage: {
        medical: 5000000,
        surgery: 10000000,
        liability: 100000000,
        mriCt: 3000000
      },
      specialFeatures: [
        '슬개골 보장 (1년 면책)',
        '전국 2,000개 제휴병원',
        '자동 청구 시스템',
        '갱신 15세까지'
      ],
      deductible: 20,
      waitingPeriod: 30,
      renewalLimit: 15,
      rating: 5,
      bestFor: ['청구 편의성', '안정성', '브랜드 신뢰'],
      recommended: ['전 견종', '소형견'],
      pros: ['업계 1위 점유율', '제휴병원 많음', '청구 간편'],
      cons: ['자기부담금 20%', '보험료 중간']
    },
    {
      id: 'samsung',
      name: '삼성화재',
      product: '애니펫',
      logo: '⭐',
      coverageRatio: 80,
      maxAge: 10,
      monthlyPremium: { '1세': 25000, '3세': 28000, '5세': 33000, '7세 이상': 40000 },
      coverage: {
        medical: 6000000,
        surgery: 8000000,
        liability: 50000000,
        mriCt: 2500000
      },
      specialFeatures: [
        '치과 특약 우수',
        '다견 10% 할인',
        '통합 앱 관리',
        '갱신 20세까지'
      ],
      deductible: 10,
      waitingPeriod: 30,
      renewalLimit: 20,
      rating: 4,
      bestFor: ['다견 가정', '치과 중시', '앱 편의성'],
      recommended: ['다견', '치과 위험'],
      pros: ['다견 할인', '치과 특화', '갱신 20세'],
      cons: ['보장비율 80%', '보험료 높음']
    },
    {
      id: 'hyundai',
      name: '현대해상',
      product: '굿앤굿우리펫',
      logo: '💎',
      coverageRatio: 100,
      maxAge: 10,
      monthlyPremium: { '1세': 23000, '3세': 26000, '5세': 31000, '7세 이상': 37000 },
      coverage: {
        medical: 7000000,
        surgery: 12000000,
        liability: 100000000,
        mriCt: 3500000
      },
      specialFeatures: [
        '100% 보장 비율',
        '피부 질환 특약',
        '구강 질환 특약',
        '가성비 최고'
      ],
      deductible: 10,
      waitingPeriod: 30,
      renewalLimit: 18,
      rating: 4,
      bestFor: ['가성비', '실속파', '피부/구강'],
      recommended: ['중형견', '실속 추구'],
      pros: ['100% 보장', '가성비 우수', '수술비 높음'],
      cons: ['갱신 18세까지']
    },
    {
      id: 'kb',
      name: 'KB손해보험',
      product: '금쪽같은펫',
      logo: '🏆',
      coverageRatio: 90,
      maxAge: 10,
      monthlyPremium: { '1세': 27000, '3세': 30000, '5세': 36000, '7세 이상': 45000 },
      coverage: {
        medical: 8000000,
        surgery: 15000000,
        liability: 100000000,
        mriCt: 5000000
      },
      specialFeatures: [
        'MRI/CT 한도 업계 최고',
        '고액 치료비 대비',
        '중증 질환 강화',
        '갱신 20세까지'
      ],
      deductible: 20,
      waitingPeriod: 30,
      renewalLimit: 20,
      rating: 5,
      bestFor: ['고액 치료', '검사비', '대형견'],
      recommended: ['대형견', '노령견'],
      pros: ['MRI/CT 최고', '수술비 최고', '중증 대비'],
      cons: ['보험료 가장 높음', '자기부담금 20%']
    },
    {
      id: 'db',
      name: 'DB손해보험',
      product: '프로미라이프 펫블리',
      logo: '🌟',
      coverageRatio: 90,
      maxAge: 12,
      monthlyPremium: { '1세': 21000, '3세': 23000, '5세': 28000, '7세 이상': 35000 },
      coverage: {
        medical: 6000000,
        surgery: 9000000,
        liability: 80000000,
        mriCt: 2800000
      },
      specialFeatures: [
        '슬개골 탈구 특화',
        '구강 질환 특화',
        '행동교정 훈련비',
        '만 12세까지 가입'
      ],
      deductible: 10,
      waitingPeriod: 30,
      renewalLimit: 17,
      rating: 4,
      bestFor: ['슬개골', '소형견', '유전 질환'],
      recommended: ['말티즈', '포메라니안', '요크셔테리어'],
      pros: ['슬개골 특화', '12세 가입', '가격 저렴'],
      cons: ['배상책임 낮음']
    },
    {
      id: 'hanwha',
      name: '한화손해보험',
      product: '댕댕이',
      logo: '🎯',
      coverageRatio: 85,
      maxAge: 10,
      monthlyPremium: { '1세': 20000, '3세': 22000, '5세': 27000, '7세 이상': 33000 },
      coverage: {
        medical: 5000000,
        surgery: 8000000,
        liability: 100000000,
        mriCt: 2000000
      },
      specialFeatures: [
        '실속 있는 보험료',
        '핵심 보장 위주',
        '온라인 가입 할인',
        '갱신 15세까지'
      ],
      deductible: 15,
      waitingPeriod: 30,
      renewalLimit: 15,
      rating: 3,
      bestFor: ['실속파', '예산 중시', '기본 보장'],
      recommended: ['예산 제한', '건강한 반려동물'],
      pros: ['가격 가장 저렴', '실속형'],
      cons: ['보장 한도 낮음', '갱신 15세']
    },
    {
      id: 'nh',
      name: 'NH농협손해보험',
      product: '지킴이펫',
      logo: '🏅',
      coverageRatio: 85,
      maxAge: 10,
      monthlyPremium: { '1세': 24000, '3세': 26000, '5세': 32000, '7세 이상': 39000 },
      coverage: {
        medical: 5500000,
        surgery: 8500000,
        liability: 150000000,
        mriCt: 2200000
      },
      specialFeatures: [
        '배상책임 1.5억원',
        '장례비용 지원',
        '농협 조합원 할인',
        '갱신 16세까지'
      ],
      deductible: 15,
      waitingPeriod: 30,
      renewalLimit: 16,
      rating: 3,
      bestFor: ['배상책임 중시', '장례비용'],
      recommended: ['배상책임 우려'],
      pros: ['배상책임 최고', '장례비용', '조합원 할인'],
      cons: ['보장 한도 중간']
    },
    {
      id: 'lotte',
      name: '롯데/하나손해보험',
      product: '펫보험',
      logo: '📋',
      coverageRatio: 80,
      maxAge: 10,
      monthlyPremium: { '1세': 22000, '3세': 24000, '5세': 29000, '7세 이상': 36000 },
      coverage: {
        medical: 5000000,
        surgery: 7500000,
        liability: 80000000,
        mriCt: 2000000
      },
      specialFeatures: [
        '기본적인 보장',
        '표준 약관'
      ],
      deductible: 20,
      waitingPeriod: 30,
      renewalLimit: 15,
      rating: 2,
      bestFor: ['제한적 추천'],
      recommended: [],
      pros: ['가격 저렴'],
      cons: ['낮은 인지도', '보장 한도 낮음']
    }
  ];

  const toggleCompany = (id) => {
    setSelectedCompanies(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getSortedCompanies = () => {
    let sorted = [...insuranceCompanies];
    
    switch (sortBy) {
      case 'premium':
        sorted.sort((a, b) => a.monthlyPremium[filterAge] - b.monthlyPremium[filterAge]);
        break;
      case 'coverage':
        sorted.sort((a, b) => b.coverage.surgery - a.coverage.surgery);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    // 예산 필터
    if (filterBudget !== 'all') {
      const [min, max] = filterBudget.split('-').map(Number);
      sorted = sorted.filter(c => {
        const premium = c.monthlyPremium[filterAge];
        return premium >= min && (max ? premium <= max : true);
      });
    }
    
    return sorted;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const getHighlightClass = (value, allValues, higher = true) => {
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    if (higher && value === max) return 'bg-green-100 text-green-800 font-bold';
    if (!higher && value === min) return 'bg-blue-100 text-blue-800 font-bold';
    return '';
  };

  const displayedCompanies = getSortedCompanies();
  const compareCompanies = selectedCompanies.length > 0
    ? insuranceCompanies.filter(c => selectedCompanies.includes(c.id))
    : displayedCompanies.slice(0, 3);

  return (
    <section id="comparison" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            📊 8개사 펫보험 상세 비교
          </h2>
          <p className="text-xl text-gray-600">
            대한민국 주요 펫보험 8개사를 한눈에 비교하세요
          </p>
        </div>

        {/* 필터 & 정렬 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                반려동물 나이
              </label>
              <select
                value={filterAge}
                onChange={(e) => setFilterAge(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1세">1세</option>
                <option value="3세">3세</option>
                <option value="5세">5세</option>
                <option value="7세 이상">7세 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월 예산
              </label>
              <select
                value={filterBudget}
                onChange={(e) => setFilterBudget(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="0-25000">2.5만원 이하</option>
                <option value="25000-30000">2.5-3만원</option>
                <option value="30000-999999">3만원 이상</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬 기준
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="premium">보험료 낮은순</option>
                <option value="coverage">보장금액 높은순</option>
                <option value="rating">평점 높은순</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비교할 보험사 ({selectedCompanies.length}개)
              </label>
              <button
                onClick={() => setSelectedCompanies([])}
                disabled={selectedCompanies.length === 0}
                className={`w-full px-4 py-2 rounded-lg transition-colors ${
                  selectedCompanies.length > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                선택 초기화
              </button>
            </div>
          </div>
        </div>

        {/* 보험사 카드 목록 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayedCompanies.map(company => (
            <div
              key={company.id}
              onClick={() => toggleCompany(company.id)}
              className={`relative bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-xl ${
                selectedCompanies.includes(company.id) ? 'ring-4 ring-blue-500' : ''
              }`}
            >
              {selectedCompanies.includes(company.id) && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              )}
              
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{company.logo}</div>
                <h3 className="font-bold text-lg text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-600">{company.product}</p>
                {company.marketShare && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    {company.marketShare}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">월 보험료</span>
                  <span className="font-bold text-blue-600">
                    {formatNumber(company.monthlyPremium[filterAge])}원
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">보장 비율</span>
                  <span className="font-semibold">{company.coverageRatio}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">평점</span>
                  <span className="font-semibold">{'⭐'.repeat(company.rating)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  클릭하여 비교에 추가
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 상세 비교표 */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">구분</th>
                  {compareCompanies.map(company => (
                    <th key={company.id} className="px-6 py-4 text-center font-semibold">
                      <div className="text-2xl mb-1">{company.logo}</div>
                      <div>{company.name}</div>
                      <div className="text-sm font-normal opacity-90">{company.product}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* 월 보험료 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    월 보험료 ({filterAge})
                  </td>
                  {compareCompanies.map(company => (
                    <td
                      key={company.id}
                      className={`px-6 py-4 text-center ${getHighlightClass(
                        company.monthlyPremium[filterAge],
                        compareCompanies.map(c => c.monthlyPremium[filterAge]),
                        false
                      )}`}
                    >
                      {formatNumber(company.monthlyPremium[filterAge])}원
                    </td>
                  ))}
                </tr>

                {/* 진료비 보장 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">진료비 보장</td>
                  {compareCompanies.map(company => (
                    <td
                      key={company.id}
                      className={`px-6 py-4 text-center ${getHighlightClass(
                        company.coverage.medical,
                        compareCompanies.map(c => c.coverage.medical)
                      )}`}
                    >
                      {formatNumber(company.coverage.medical)}원
                    </td>
                  ))}
                </tr>

                {/* 수술비 보장 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">수술비 보장</td>
                  {compareCompanies.map(company => (
                    <td
                      key={company.id}
                      className={`px-6 py-4 text-center ${getHighlightClass(
                        company.coverage.surgery,
                        compareCompanies.map(c => c.coverage.surgery)
                      )}`}
                    >
                      {formatNumber(company.coverage.surgery)}원
                    </td>
                  ))}
                </tr>

                {/* MRI/CT */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">MRI/CT 보장</td>
                  {compareCompanies.map(company => (
                    <td
                      key={company.id}
                      className={`px-6 py-4 text-center ${getHighlightClass(
                        company.coverage.mriCt,
                        compareCompanies.map(c => c.coverage.mriCt)
                      )}`}
                    >
                      {formatNumber(company.coverage.mriCt)}원
                    </td>
                  ))}
                </tr>

                {/* 배상책임 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">배상책임</td>
                  {compareCompanies.map(company => (
                    <td
                      key={company.id}
                      className={`px-6 py-4 text-center ${getHighlightClass(
                        company.coverage.liability,
                        compareCompanies.map(c => c.coverage.liability)
                      )}`}
                    >
                      {company.coverage.liability >= 100000000 ? '1억원' : formatNumber(company.coverage.liability) + '원'}
                    </td>
                  ))}
                </tr>

                {/* 보장 비율 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">보장 비율</td>
                  {compareCompanies.map(company => (
                    <td
                      key={company.id}
                      className={`px-6 py-4 text-center ${getHighlightClass(
                        company.coverageRatio,
                        compareCompanies.map(c => c.coverageRatio)
                      )}`}
                    >
                      {company.coverageRatio}%
                    </td>
                  ))}
                </tr>

                {/* 자기부담금 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">자기부담금</td>
                  {compareCompanies.map(company => (
                    <td
                      key={company.id}
                      className={`px-6 py-4 text-center ${getHighlightClass(
                        company.deductible,
                        compareCompanies.map(c => c.deductible),
                        false
                      )}`}
                    >
                      {company.deductible}%
                    </td>
                  ))}
                </tr>

                {/* 가입 연령 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">가입 가능 연령</td>
                  {compareCompanies.map(company => (
                    <td key={company.id} className="px-6 py-4 text-center">
                      만 {company.maxAge}세
                    </td>
                  ))}
                </tr>

                {/* 갱신 한도 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">갱신 한도</td>
                  {compareCompanies.map(company => (
                    <td
                      key={company.id}
                      className={`px-6 py-4 text-center ${getHighlightClass(
                        company.renewalLimit,
                        compareCompanies.map(c => c.renewalLimit)
                      )}`}
                    >
                      {company.renewalLimit}세
                    </td>
                  ))}
                </tr>

                {/* 평점 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">평점</td>
                  {compareCompanies.map(company => (
                    <td key={company.id} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {'⭐'.repeat(company.rating)}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 특별 보장 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 align-top">특별 보장</td>
                  {compareCompanies.map(company => (
                    <td key={company.id} className="px-6 py-4">
                      <ul className="text-sm space-y-1">
                        {company.specialFeatures.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* 추천 대상 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 align-top">추천 대상</td>
                  {compareCompanies.map(company => (
                    <td key={company.id} className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {company.bestFor.map((tag, i) => (
                          <span key={i} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 장점 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 align-top">장점</td>
                  {compareCompanies.map(company => (
                    <td key={company.id} className="px-6 py-4">
                      <ul className="text-sm space-y-1 text-green-700">
                        {company.pros.map((pro, i) => (
                          <li key={i}>• {pro}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* 단점 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 align-top">단점</td>
                  {compareCompanies.map(company => (
                    <td key={company.id} className="px-6 py-4">
                      <ul className="text-sm space-y-1 text-orange-700">
                        {company.cons.map((con, i) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* 상담 신청 */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">상담 신청</td>
                  {compareCompanies.map(company => (
                    <td key={company.id} className="px-6 py-4 text-center">
                      <a
                        href="#contact"
                        className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                      >
                        무료 상담
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            펫보험 가입 시 꼭 확인하세요!
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>가입 나이 제한:</strong> 대부분 만 10세까지 가입 가능합니다. DB손해보험만 만 12세까지 가능!</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>슬개골/고관절 질환:</strong> 가입 후 1년 면책기간이 있습니다. 한 살이라도 어릴 때 가입하세요!</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>MRI/CT 검사비:</strong> 수백만 원이 드는 고액 검사입니다. 보장 한도를 꼭 확인하세요.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>자기부담금:</strong> 10-20% 본인 부담입니다. 낮을수록 유리합니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>갱신 한도:</strong> 15-20세까지 차이가 납니다. 장기 보장이 중요합니다.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
