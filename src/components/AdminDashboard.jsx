import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [contentList, setContentList] = useState([]);
  const [insuranceData, setInsuranceData] = useState({});
  const [metrics, setMetrics] = useState({
    totalVisitors: 15234,
    conversionRate: 12.5,
    avgSessionTime: '4m 32s',
    bounceRate: 28.3
  });

  // 콘텐츠 목록 (자동 생성된 콘텐츠)
  const sampleContent = [
    {
      id: 1,
      type: '블로그',
      title: '2026년 펫보험 선택 가이드: 당신의 반려동물에 맞는 보험은?',
      date: '2026-03-02',
      status: '발행됨',
      views: 2341,
      likes: 156,
      platform: 'Blog'
    },
    {
      id: 2,
      type: 'SNS',
      title: '슬개골탈구가 있는 말티즈라면? 필수 보험 항목 Top 3 🐕',
      date: '2026-03-02',
      status: '발행됨',
      platform: 'Instagram',
      engagement: 452
    },
    {
      id: 3,
      type: '뉴스레터',
      title: '주간 펫보험 동향: KB 신상품 출시, 메리츠 보험료 인상',
      date: '2026-03-01',
      status: '발행됨',
      subscribers: 8932,
      openRate: 34.2
    },
    {
      id: 4,
      type: '블로그',
      title: '고양이 비뇨기질환 예방법과 보험 대비 전략',
      date: '2026-03-01',
      status: '예약됨',
      scheduledDate: '2026-03-05 08:00',
      platform: 'Blog'
    }
  ];

  useEffect(() => {
    setContentList(sampleContent);
  }, []);

  // 자동 콘텐츠 생성 함수
  const generateContent = async (type) => {
    const newContent = {
      id: contentList.length + 1,
      type,
      title: '자동 생성 중...',
      date: new Date().toISOString().split('T')[0],
      status: '생성 중',
      platform: type === '블로그' ? 'Blog' : 'Social'
    };

    setContentList([newContent, ...contentList]);

    // 시뮬레이션: 1초 후 생성 완료
    setTimeout(() => {
      const updatedList = contentList.map(item =>
        item.id === newContent.id
          ? {
              ...item,
              title: `자동 생성됨: ${type} 콘텐츠 - ${new Date().toLocaleString('ko-KR')}`,
              status: '검토 대기',
              views: 0,
              likes: 0,
              engagement: 0
            }
          : item
      );
      setContentList([updatedList[0], ...contentList.slice(1)]);
    }, 1000);
  };

  // 보험료 수동 갱신
  const updateInsuranceData = () => {
    const updated = {
      '메리츠': { premium: 25000, change: '+2%' },
      '현대': { premium: 26000, change: '-0.5%' },
      'KB': { premium: 30000, change: '+1.5%' },
      'DB': { premium: 23000, change: '변화 없음' }
    };
    setInsuranceData(updated);

    // 성공 메시지
    alert('✅ 보험료 데이터가 갱신되었습니다. (2026-03-02 14:35)');
  };

  return (
    <section id="admin-dashboard" className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-12">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            ⚙️ 관리자 패널
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            자율진화형 대시보드
          </h2>
          <p className="text-xl text-gray-600">
            자동화된 콘텐츠, 데이터, 성과를 한곳에서 관리하세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8 flex flex-wrap gap-2">
          {[
            { id: 'overview', label: '📊 대시보드', icon: '📊' },
            { id: 'content', label: '📝 콘텐츠 관리', icon: '📝' },
            { id: 'insurance', label: '📋 데이터 관리', icon: '📋' },
            { id: 'analytics', label: '📈 성과 분석', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.icon}</span>
            </button>
          ))}
        </div>

        {/* 1. 대시보드 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: '방문자', value: metrics.totalVisitors.toLocaleString(), icon: '👥', color: 'blue' },
                { label: '전환율', value: `${metrics.conversionRate}%`, icon: '📊', color: 'green' },
                { label: '평균 체류', value: metrics.avgSessionTime, icon: '⏱️', color: 'yellow' },
                { label: '이탈율', value: `${metrics.bounceRate}%`, icon: '📉', color: 'red' }
              ].map((metric, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 rounded-xl p-6 border-l-4 border-${metric.color}-500`}
                >
                  <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-2">지난 7일</p>
                </div>
              ))}
            </div>

            {/* 자동화 상태 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🤖 자동화 상태</h3>
              <div className="space-y-4">
                {[
                  { name: '블로그 자동 생성', status: '정상', nextRun: '매일 자정', progress: 100 },
                  { name: 'SNS 자동 발행', status: '정상', nextRun: '4시간마다', progress: 100 },
                  { name: '뉴스레터 자동화', status: '정상', nextRun: '월요일 8AM', progress: 100 },
                  { name: '데이터 자동 갱신', status: '예약됨', nextRun: '2026-03-05', progress: 45 }
                ].map((task, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl">
                      {task.status === '정상' ? '✅' : '⏳'}
                    </span>
                    <div className="flex-grow">
                      <p className="font-bold text-gray-900">{task.name}</p>
                      <p className="text-sm text-gray-600">{task.nextRun}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                      task.status === '정상'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. 콘텐츠 관리 */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* 콘텐츠 생성 버튼 */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">🚀 새 콘텐츠 생성</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { type: '블로그', icon: '📄', desc: '1500-2000자 블로그 포스트' },
                  { type: 'SNS', icon: '📱', desc: '인스타, 트위터, 페이스북' },
                  { type: '뉴스레터', icon: '📧', desc: '주간 뉴스레터 자동 생성' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => generateContent(item.type)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all rounded-lg p-4 text-left"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="font-bold">{item.type}</p>
                    <p className="text-sm opacity-80">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 콘텐츠 목록 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">📝 최근 콘텐츠</h3>
              </div>
              <div className="space-y-2">
                {contentList.map((content, idx) => (
                  <div
                    key={idx}
                    className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-all flex items-start justify-between"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                          {content.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          content.status === '발행됨'
                            ? 'bg-green-100 text-green-700'
                            : content.status === '예약됨'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {content.status}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 mb-1">{content.title}</p>
                      <p className="text-sm text-gray-600">
                        {content.date} • {content.platform}
                        {content.scheduledDate && ` • 예약: ${content.scheduledDate}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">
                        {content.views || content.engagement || content.subscribers || '대기'}
                      </div>
                      <p className="text-xs text-gray-600">
                        {content.views ? '조회수' : content.engagement ? '참여도' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. 데이터 관리 */}
        {activeTab === 'insurance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">📊 보험료 데이터</h3>
                <button
                  onClick={updateInsuranceData}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  🔄 데이터 갱신
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(insuranceData).length > 0 ? (
                  Object.entries(insuranceData).map(([company, data], idx) => (
                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border-l-4 border-blue-500">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">{company}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">월 보험료</span>
                          <span className="font-bold text-gray-900">₩{data.premium.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">변화</span>
                          <span className={`font-bold ${
                            data.change === '변화 없음' ? 'text-gray-600' :
                            data.change.includes('+') ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {data.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    <p className="text-lg">📋 "데이터 갱신" 버튼을 눌러 최신 정보를 로드하세요</p>
                  </div>
                )}
              </div>

              {/* 자동 갱신 설정 */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">🤖 자동 갱신 설정</h4>
                <div className="space-y-3">
                  {[
                    { label: '매일 자동 갱신', enabled: true },
                    { label: '보험료 인상 알림', enabled: true },
                    { label: '신상품 출시 알림', enabled: false },
                    { label: '갱신 한도 변경 알림', enabled: true }
                  ].map((setting, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={setting.enabled}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-gray-700 font-medium">{setting.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. 성과 분석 */}
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: '사용자 행동 분석',
                icon: '👤',
                metrics: [
                  { label: '신규 사용자', value: '2,341', trend: '+15.3%' },
                  { label: '재방문자', value: '8,234', trend: '+8.2%' },
                  { label: '평균 클릭', value: '4.7', trend: '+2.1%' }
                ]
              },
              {
                title: '전환율 분석',
                icon: '📊',
                metrics: [
                  { label: '비교표 진입률', value: '68.5%', trend: '+5.2%' },
                  { label: '상담 신청률', value: '12.5%', trend: '+3.1%' },
                  { label: '클릭-구매율', value: '8.3%', trend: '+1.8%' }
                ]
              },
              {
                title: '콘텐츠 성과',
                icon: '📝',
                metrics: [
                  { label: '블로그 평균 조회', value: '2,145', trend: '+22.5%' },
                  { label: 'SNS 평균 참여', value: '384', trend: '+35.2%' },
                  { label: '뉴스레터 개봉율', value: '34.2%', trend: '+12.1%' }
                ]
              },
              {
                title: 'AI 추천 성과',
                icon: '🤖',
                metrics: [
                  { label: '추천 정확도', value: '94.3%', trend: '+2.1%' },
                  { label: '성향분석 활용', value: '6,234명', trend: '+45.3%' },
                  { label: '필터링 사용율', value: '78.2%', trend: '+18.5%' }
                ]
              }
            ].map((section, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  {section.icon} {section.title}
                </h3>
                <div className="space-y-4">
                  {section.metrics.map((metric, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium">{metric.label}</span>
                        <span className={`text-sm font-bold ${
                          metric.trend.includes('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.trend}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 하단 주의사항 */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <p className="text-yellow-800">
            <strong>💡 주의:</strong> 이 대시보드는 자율진화형 플랫폼 시뮬레이션입니다.
            실제 구현 시 Supabase, Firebase 등 백엔드 서비스와 연동되어 실시간 데이터를 반영합니다.
            데이터 자동 갱신은 매일 자정에 실행되며, 이상 발생 시 자동으로 알림을 받습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
