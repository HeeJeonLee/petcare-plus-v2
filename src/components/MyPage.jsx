import { useState, useEffect } from 'react';

export default function MyPage() {
  const [consultations, setConsultations] = useState([]);
  const [healthCalculations, setHealthCalculations] = useState([]);
  const [activeTab, setActiveTab] = useState('consultations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 데이터 로드
    const loadData = async () => {
      try {
        // 1. Supabase에서 상담 기록 로드
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        let dbConsultations = [];
        if (supabaseUrl && supabaseKey) {
          try {
            const response = await fetch(
              `${supabaseUrl}/rest/v1/consultant_inquiries?order=created_at.desc&limit=100`,
              {
                method: 'GET',
                headers: {
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`
                }
              }
            );

            if (response.ok) {
              dbConsultations = await response.json();
            }
          } catch (err) {
            console.log('Supabase 로드 실패:', err);
          }
        }

        // 2. localStorage에서 상담 기록 로드
        const savedConsultations = JSON.parse(
          localStorage.getItem('consultationHistory') || '[]'
        );

        // 3. 로컬 폼 제출 히스토리
        const formSubmissions = JSON.parse(
          localStorage.getItem('formSubmissions') || '[]'
        );

        // 모두 합치기 (최신순 정렬)
        const combined = [...dbConsultations, ...savedConsultations, ...formSubmissions]
          .sort((a, b) => {
            const dateA = new Date(a.created_at || a.timestamp || 0);
            const dateB = new Date(b.created_at || b.timestamp || 0);
            return dateB - dateA;
          });

        setConsultations(combined.slice(0, 50)); // 최대 50개

        // 4. 건강 계산 이력
        const lastCalc = JSON.parse(
          localStorage.getItem('lastHealthCalculation') || 'null'
        );
        if (lastCalc) {
          setHealthCalculations([lastCalc]);
        }
      } catch (err) {
        console.error('데이터 로드 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPetEmoji = (petType) => {
    const emojis = {
      강아지: '🐕',
      고양이: '🐈',
      기타: '🐾'
    };
    return emojis[petType] || '🐾';
  };

  const handleClearHistory = () => {
    if (confirm('정말로 모든 이력을 삭제하시겠습니까?')) {
      localStorage.removeItem('consultationHistory');
      localStorage.removeItem('formSubmissions');
      localStorage.removeItem('lastHealthCalculation');
      setConsultations([]);
      setHealthCalculations([]);
      alert('✅ 모든 이력이 삭제되었습니다.');
    }
  };

  return (
    <section id="mypage" className="py-20 bg-gradient-to-b from-purple-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">

        {/* 헤더 */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            👤 개인정보
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            📋 나의 상담 기록 및 이력
          </h2>
          <p className="text-xl text-gray-600">
            지금까지 요청하신 상담과 계산 결과를 한눈에 확인하세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-2xl shadow-lg p-1 mb-8 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setActiveTab('consultations')}
            className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
              activeTab === 'consultations'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💬 상담 신청 기록 ({consultations.length})
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
              activeTab === 'health'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💚 건강 계산 이력 ({healthCalculations.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block px-6 py-3 bg-white rounded-lg shadow">
              <p className="text-gray-600">📊 데이터를 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <>
            {/* 상담 신청 기록 탭 */}
            {activeTab === 'consultations' && (
              <div className="space-y-4">
                {consultations.length > 0 ? (
                  <>
                    {consultations.map((consultation, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border-l-4 border-blue-500"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          {/* 왼쪽: 기본 정보 */}
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-bold text-gray-900">
                                {consultation.name || '(이름 없음)'}
                              </h3>
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {consultation.pet_type && `${getPetEmoji(consultation.pet_type)} ${consultation.pet_type}`}
                                {consultation.petType && `${getPetEmoji(consultation.petType)} ${consultation.petType}`}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm">
                              {(consultation.phone || consultation.phone) && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">📞</span>
                                  <span className="text-gray-700">{consultation.phone}</span>
                                </div>
                              )}
                              {(consultation.email || consultation.email) && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">📧</span>
                                  <span className="text-gray-700">{consultation.email}</span>
                                </div>
                              )}
                              {(consultation.pet_age || consultation.petAge) && (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">🎂</span>
                                  <span className="text-gray-700">{consultation.pet_age || consultation.petAge}</span>
                                </div>
                              )}
                            </div>

                            {(consultation.message || consultation.message) && (
                              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                <p className="text-sm text-gray-700">
                                  <strong>📝 요청사항:</strong> {consultation.message}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* 오른쪽: 상태 및 날짜 */}
                          <div className="flex flex-col items-end justify-between md:min-w-[150px]">
                            <div className="mb-4">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                ✅ 접수 완료
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                {formatDate(consultation.created_at || consultation.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-8 text-center">
                      <button
                        onClick={handleClearHistory}
                        className="px-6 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-all border border-red-200"
                      >
                        🗑️ 이력 삭제
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-gray-600 text-lg">상담 신청 기록이 없습니다.</p>
                    <p className="text-gray-500 text-sm mt-2">
                      상담을 신청하면 여기에 기록됩니다.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 건강 계산 이력 탭 */}
            {activeTab === 'health' && (
              <div>
                {healthCalculations.length > 0 ? (
                  healthCalculations.map((calc, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-md p-8 border-l-4 border-green-500">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* 왼쪽: 반려동물 정보 */}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            {calc.petInfo.type === '강아지' ? '🐕' : '🐈'} {calc.petInfo.type} 건강 계산 정보
                          </h3>

                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-xs text-gray-600">반려동물 종류</p>
                              <p className="text-lg font-bold text-gray-900">{calc.petInfo.type}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-xs text-gray-600">나이대</p>
                              <p className="text-lg font-bold text-gray-900">{calc.petInfo.age}</p>
                            </div>

                            {calc.petInfo.breed && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-600">견종/묘종</p>
                                <p className="text-lg font-bold text-gray-900">{calc.petInfo.breed}</p>
                              </div>
                            )}

                            {calc.petInfo.weight && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-600">체중</p>
                                <p className="text-lg font-bold text-gray-900">{calc.petInfo.weight} kg</p>
                              </div>
                            )}

                            {calc.healthConditions.length > 0 && (
                              <div className="bg-red-50 rounded-lg p-4">
                                <p className="text-xs text-gray-600 mb-2">건강 상태</p>
                                <div className="flex flex-wrap gap-2">
                                  {calc.healthConditions.map(condition => (
                                    <span
                                      key={condition}
                                      className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium"
                                    >
                                      {condition}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 오른쪽: 계산 결과 */}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-6">💰 계산 결과</h3>

                          {/* 주요 수치 */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
                            <p className="text-sm text-gray-600 mb-2">📅 월 예상 의료비</p>
                            <p className="text-4xl font-bold text-green-600">
                              ₩{calc.result.total.toLocaleString()}
                            </p>
                          </div>

                          {/* 보험료 추정 */}
                          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                            <p className="text-sm text-gray-600 mb-2">📊 월 보험료 추정</p>
                            <p className="text-3xl font-bold text-blue-600">
                              ₩{Math.round(calc.result.total * 0.25).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">(의료비의 약 25% 권장)</p>
                          </div>

                          {/* 상세 내역 */}
                          <div className="bg-gray-50 rounded-xl p-6">
                            <h4 className="font-bold text-gray-900 mb-4">📋 의료비 상세</h4>
                            <div className="space-y-2 text-sm">
                              {Object.entries(calc.result.breakdown).map(([category, cost]) => (
                                <div key={category} className="flex justify-between">
                                  <span className="text-gray-700">{category}</span>
                                  <span className="font-bold text-gray-900">₩{cost.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 계산 일시 */}
                          <p className="text-xs text-gray-500 text-center mt-6">
                            {formatDate(calc.result.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <div className="text-5xl mb-4">💚</div>
                    <p className="text-gray-600 text-lg">건강 계산 이력이 없습니다.</p>
                    <p className="text-gray-500 text-sm mt-2">
                      건강 계산기를 사용하면 여기에 기록됩니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* CTA 섹션 */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            💬 더 자세한 상담이 필요하신가요?
          </h3>
          <p className="mb-6 opacity-90">
            AI 챗봇에서 언제든 무료 상담을 받거나, 전문가와 연결해드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#ai-recommendation"
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-100 transition-all"
            >
              🎯 AI 맞춤 추천
            </a>
            <a
              href="#contact"
              className="px-8 py-3 bg-white bg-opacity-30 text-white rounded-full font-bold border-2 border-white hover:bg-opacity-50 transition-all"
            >
              📞 상담 신청
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
