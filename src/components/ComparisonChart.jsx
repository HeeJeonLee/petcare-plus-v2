import { useState } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';

export default function ComparisonChart({ companies = [], selectedCompanies = [], filterAge = '5' }) {
  const [chartType, setChartType] = useState('radar');
  const [scenarioType, setScenarioType] = useState('surgery');

  // 기본 보험사 데이터가 없으면 기본값 설정
  const insuranceData = companies.length > 0 ? companies : [
    {
      name: '메리츠',
      monthlyPremium: { '1': 21000, '3': 23000, '5': 25000, '7': 32000 },
      surgeryLimit: 5000000,
      deductible: 20,
      rating: 4.8
    },
    {
      name: '현대',
      monthlyPremium: { '1': 22000, '3': 24000, '5': 26000, '7': 34000 },
      surgeryLimit: 5000000,
      deductible: 10,
      rating: 4.7
    },
    {
      name: 'KB',
      monthlyPremium: { '1': 25000, '3': 28000, '5': 30000, '7': 45000 },
      surgeryLimit: 6000000,
      deductible: 20,
      rating: 4.9
    },
    {
      name: 'DB',
      monthlyPremium: { '1': 20000, '3': 22000, '5': 23000, '7': 30000 },
      surgeryLimit: 4500000,
      deductible: 20,
      rating: 4.6
    }
  ];

  // 비교할 보험사 선택 (선택된 것이 없으면 상위 3개)
  const compareCompanies = selectedCompanies.length > 0
    ? insuranceData.filter(c => selectedCompanies.includes(c.name))
    : insuranceData.slice(0, 3);

  // 1. 레이더 차트 데이터 (다차원 비교)
  const getRadarData = () => {
    return [
      {
        category: '월 보험료',
        // 역순: 낮을수록 높은 점수 (100-정규화)
        메리츠: 100 - (compareCompanies[0]?.monthlyPremium[filterAge] || 25000) / 450 * 100,
        현대: 100 - (compareCompanies[1]?.monthlyPremium[filterAge] || 26000) / 450 * 100,
        KB: 100 - (compareCompanies[2]?.monthlyPremium[filterAge] || 30000) / 450 * 100
      },
      {
        category: '수술비 보장',
        메리츠: (compareCompanies[0]?.surgeryLimit || 5000000) / 60000,
        현대: (compareCompanies[1]?.surgeryLimit || 5000000) / 60000,
        KB: (compareCompanies[2]?.surgeryLimit || 6000000) / 60000
      },
      {
        category: '자기부담금',
        // 낮을수록 좋음
        메리츠: 100 - (compareCompanies[0]?.deductible || 20) * 2,
        현대: 100 - (compareCompanies[1]?.deductible || 10) * 2,
        KB: 100 - (compareCompanies[2]?.deductible || 20) * 2
      },
      {
        category: '고객만족도',
        메리츠: (compareCompanies[0]?.rating || 4.8) * 20,
        현대: (compareCompanies[1]?.rating || 4.7) * 20,
        KB: (compareCompanies[2]?.rating || 4.9) * 20
      },
      {
        category: '갱신한도',
        메리츠: 80,
        현대: 85,
        KB: 90
      }
    ];
  };

  // 2. 시나리오 계산 (수술비, 장기 보험료)
  const calculateScenario = () => {
    const surgeryAmount = 3000000;
    const years = 5;

    return compareCompanies.map(company => {
      const monthlyPremium = company.monthlyPremium[filterAge] || 25000;
      const deductible = company.deductible || 20;
      const annualPremium = monthlyPremium * 12;

      // 시나리오: 수술 1회
      const netPaymentSurgery = surgeryAmount * (100 - (100 - deductible)) / 100;
      const monthlyPaymentSurgery = netPaymentSurgery / 12;

      // 시나리오: 5년간 총 비용
      const totalPremium5Years = annualPremium * years;

      // 손익분기점
      const breakEvenClaims = annualPremium / (1 - deductible / 100);

      return {
        name: company.name,
        monthlyPremium,
        annualPremium,
        totalPremium5Years,
        surgeryAmount,
        netPaymentSurgery,
        claimRatio: deductible,
        breakEvenClaims: Math.round(breakEvenClaims),
        fiveYearCost: totalPremium5Years
      };
    });
  };

  const scenarioData = calculateScenario();

  // 3. 누적 비용 비교 차트
  const getCumulativeCostData = () => {
    const years = [1, 2, 3, 4, 5];
    return years.map(year => {
      const data = { year: `${year}년` };
      compareCompanies.forEach((company, idx) => {
        const monthlyPremium = company.monthlyPremium[filterAge] || 25000;
        data[company.name] = monthlyPremium * 12 * year;
      });
      return data;
    });
  };

  // 4. 월 보험료 비교
  const getMonthlyComparisonData = () => {
    return compareCompanies.map(company => ({
      name: company.name,
      '보험료': company.monthlyPremium[filterAge] || 25000
    }));
  };

  return (
    <div className="space-y-8">
      {/* 차트 타입 선택 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📊 비교 분석 차트</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'radar', label: '🎯 다차원 비교' },
              { value: 'monthly', label: '💰 월 보험료' },
              { value: 'cumulative', label: '📈 5년 누적 비용' },
              { value: 'scenario', label: '🏥 시나리오 분석' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setChartType(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  chartType === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. 레이더 차트 - 다차원 비교 */}
        {chartType === 'radar' && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-4">
              🎯 <strong>5가지 요소 종합 비교:</strong> 보험료(낮을수록 우수), 수술비 보장, 자기부담금(낮을수록), 고객만족도, 갱신한도
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={getRadarData()}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="메리츠"
                  dataKey="메리츠"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.25}
                />
                <Radar
                  name="현대"
                  dataKey="현대"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.25}
                />
                {compareCompanies[2] && (
                  <Radar
                    name="KB"
                    dataKey="KB"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.25}
                  />
                )}
                <Legend />
                <Tooltip formatter={(value) => value.toFixed(1)} />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-600 mt-4 text-center">
              💡 넓은 면적일수록 종합 점수가 높습니다
            </p>
          </div>
        )}

        {/* 2. 월 보험료 비교 */}
        {chartType === 'monthly' && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-4">
              💰 <strong>월 보험료 비교 (나이: {filterAge}세):</strong> 누구가 제일 저렴할까?
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getMonthlyComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `₩${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="보험료" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-600 mt-4">
              📊 가장 저렴한 보험료: {Math.min(...compareCompanies.map(c => c.monthlyPremium[filterAge])).toLocaleString()}원
            </p>
          </div>
        )}

        {/* 3. 누적 비용 (5년) */}
        {chartType === 'cumulative' && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-4">
              📈 <strong>5년 누적 보험료:</strong> 장기적으로 누가 더 유리할까?
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getCumulativeCostData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `₩${(value / 1000000).toFixed(1)}M`}
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                {compareCompanies.map((company, idx) => (
                  <Line
                    key={company.name}
                    type="monotone"
                    dataKey={company.name}
                    stroke={['#3b82f6', '#10b981', '#f59e0b'][idx]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 4. 시나리오 분석 */}
        {chartType === 'scenario' && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-4">
              🏥 <strong>시나리오:</strong> 슬개골 수술 (수술비 300만원)이 발생하면?
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {scenarioData.map((scenario, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border-l-4 border-blue-500"
                >
                  <h4 className="font-bold text-gray-900 mb-3">{scenario.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">월 보험료:</span>
                      <span className="font-bold">₩{scenario.monthlyPremium.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">수술비 청구액:</span>
                      <span className="font-bold">₩{scenario.netPaymentSurgery.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">자기부담금:</span>
                      <span className="font-bold text-red-600">{scenario.claimRatio}%</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="text-gray-600">5년 총 비용:</span>
                      <span className="font-bold text-blue-600">
                        ₩{scenario.fiveYearCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
              <h5 className="font-bold text-gray-900 mb-3">💡 분석 결과</h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  ✅ <strong>가장 저렴한 월 보험료:</strong>{' '}
                  {scenarioData.reduce((a, b) => a.monthlyPremium < b.monthlyPremium ? a : b).name}
                  (₩{Math.min(...scenarioData.map(s => s.monthlyPremium)).toLocaleString()})
                </li>
                <li>
                  ✅ <strong>가장 낮은 자기부담금:</strong>{' '}
                  {scenarioData.reduce((a, b) => a.claimRatio < b.claimRatio ? a : b).name}
                  ({Math.min(...scenarioData.map(s => s.claimRatio))}%)
                </li>
                <li>
                  ✅ <strong>장기적으로 유리한 보험사:</strong> 5년 누적 비용이 가장 낮은 회사는{' '}
                  {scenarioData.reduce((a, b) => a.fiveYearCost < b.fiveYearCost ? a : b).name}
                  입니다.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 하이라이트 통계 */}
      <div className="grid md:grid-cols-4 gap-4">
        {scenarioData.map((scenario, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-bold text-gray-600 mb-2">{scenario.name}</h4>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              ₩{scenario.monthlyPremium.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">월 보험료</p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                자기부담금: <span className="font-bold">{scenario.claimRatio}%</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
