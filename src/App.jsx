import { useState, useEffect } from 'react';
import AIRecommendation from './components/AIRecommendation';
import InsuranceComparison from './components/InsuranceComparison';
import HospitalFinder from './components/HospitalFinder';
import ClaimProcess from './components/ClaimProcess';
import ChatBot from './components/ChatBot';
import analytics from './utils/analytics';
import contentGenerator from './utils/contentGenerator';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    petType: '',
    petAge: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Analytics 및 Content Generation 초기화
  useEffect(() => {
    // 페이지 뷰 추적
    analytics.trackPageView('landing_page', { referrer: document.referrer });

    // 콘텐츠 생성 스케줄링 (선택사항)
    if (process.env.VITE_CONTENT_GENERATION_ENABLED === 'true') {
      contentGenerator.scheduleContentGeneration();
    }

    // 자동 최적화 제안 생성 (5분마다)
    const optimizationInterval = setInterval(() => {
      analytics.generateOptimizationSuggestions();
    }, 300000);

    return () => clearInterval(optimizationInterval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // 📋 폼 유효성 검사
    if (!formData.name.trim()) {
      alert('❌ 이름을 입력해주세요.');
      return;
    }

    const phoneRegex = /^(\d{3})-?(\d{3,4})-?(\d{4})$|^\d{10,11}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.replace(/-/g, ''))) {
      alert('❌ 올바른 연락처를 입력해주세요. (예: 010-1234-5678)');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('❌ 올바른 이메일을 입력해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      // 🔒 환경 변수에서 값 읽기
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const consultantCode = import.meta.env.VITE_CONSULTANT_CODE || '251220019';
      const consultantPhone = import.meta.env.VITE_CONSULTANT_PHONE || '';

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase 설정이 필요합니다.');
      }

      // 1단계: Supabase DB 저장
      let dbSaved = false;

      try {
        const dbRes = await fetch(`${supabaseUrl}/rest/v1/consultant_inquiries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email?.trim() || null,
            pet_type: formData.petType,
            pet_age: formData.petAge,
            message: formData.message?.trim() || '',
            consultant_code: consultantCode
          })
        });
        dbSaved = dbRes.ok || dbRes.status === 201;
        if (!dbSaved) {
          const errorText = await dbRes.text();
          console.warn('📦 Supabase 저장 실패:', errorText);
        }
      } catch (dbErr) {
        console.error('📦 Supabase 연결 오류:', dbErr);
      }

      // 2단계: 이메일 발송 API 호출 (선택)
      let emailSent = false;
      try {
        const emailRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            petType: formData.petType,
            petAge: formData.petAge,
            message: formData.message
          })
        });

        if (!emailRes.ok) {
          const errorData = await emailRes.json();
          console.warn('📧 이메일 발송 실패:', errorData);
        } else {
          emailSent = true;
          console.log('✅ 이메일 발송 성공');
        }
      } catch (emailErr) {
        console.warn('📧 이메일 서비스 오류:', emailErr.message);
      }

      // 3단계: 성공 여부 판단
      if (!dbSaved && !emailSent) {
        throw new Error('상담 신청을 처리할 수 없습니다. 나중에 다시 시도해주세요.');
      }

      // 성공 처리
      analytics.trackConversion('consultation_request', {
        petType: formData.petType,
        petAge: formData.petAge,
        hasMessage: !!formData.message,
        dbSaved,
        emailSent
      });

      // 성공 메시지
      let successMsg = '✅ 상담 신청이 완료되었습니다!\n\n';
      if (dbSaved) successMsg += '📦 신청 정보가 저장되었습니다.\n';
      if (emailSent) successMsg += '📧 확인 이메일이 발송되었습니다.\n';
      successMsg += '\n24시간 내 연락드리겠습니다.\n감사합니다! 🐾';

      alert(successMsg);
      setFormData({ name: '', phone: '', email: '', petType: '', petAge: '', message: '' });

    } catch (error) {
      console.error('❌ 상담 신청 오류:', error);
      const consultantPhone = import.meta.env.VITE_CONSULTANT_PHONE || '';
      alert(`❌ 오류가 발생했습니다.\n\n💬 아래 AI 챗봇에서 도움을 받으시거나\n📋 잠시 후 다시 시도해주세요.\n\n(24시간 AI 상담 가능)`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 법적 면책 공고 */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-0">
        <p className="text-sm text-yellow-700 text-center">
          ⚠️ <strong>면책 공고:</strong> 본 페이지는 펫보험 상품의 정보 제공을 목적으로 하며, 특정 상품 가입을 강제하거나 권유하지 않습니다. 실제 가입 전 각 보험사의 약관을 꼭 확인하시고, 필요시 보험사 고객센터에 문의하시기 바랍니다.
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            🐾 PetCare+
          </h1>
          <p className="text-2xl md:text-3xl mb-4 font-semibold">
            대한민국 8개 주요 펫보험 비교 플랫폼
          </p>
          <p className="text-xl mb-8 opacity-90">
            AI가 추천하는 우리 아이에게 딱 맞는 보험
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href="#ai-recommendation"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-lg transform hover:scale-105"
            >
              🎯 AI 맞춤 추천 받기
            </a>
            <a
              href="#comparison"
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-lg transform hover:scale-105"
            >
              📊 8개사 상세 비교
            </a>
            <a
              href="/documents/PetCare+_사업계획서.pptx"
              download
              className="px-8 py-4 bg-white text-pink-600 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-lg transform hover:scale-105"
              title="정부 정책자금 신청용 사업계획서"
            >
              📥 사업계획서 다운로드
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 flex flex-col h-full">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold text-xl mb-2">AI 맞춤 추천</h3>
              <p className="opacity-90 flex-grow">우리 아이 정보 입력하면 AI가 최적 보험 추천</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 flex flex-col h-full">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-xl mb-2">8개사 상세 비교</h3>
              <p className="opacity-90 flex-grow">메리츠, 삼성, 현대, KB, DB, 한화, 농협, 롯데</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 flex flex-col h-full">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-xl mb-2">AI 챗봇 상담</h3>
              <p className="opacity-90 flex-grow">Claude AI 기반 24시간 무료 실시간 상담</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI 맞춤형 추천 */}
      <AIRecommendation />

      {/* 8개사 상세 비교 */}
      <InsuranceComparison />

      {/* 주변 동물병원 찾기 */}
      <HospitalFinder />

      {/* 보험금 청구 프로세스 */}
      <ClaimProcess />

      {/* 상담 신청 */}
      <section id="contact" className="py-20 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              💬 펫 라이프 맞춤 설계 리포트 신청
            </h2>
            <p className="text-xl text-gray-600">
              반려견 맞춤형 보장 분석 및 전문가 연결 서비스
            </p>
            <div className="mt-4 inline-block px-6 py-3 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
              ✨ 무료 분석 · 비대면 · 24시간 전문가 상담
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">반려동물 종류</label>
                  <select
                    value={formData.petType}
                    onChange={(e) => setFormData({...formData, petType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택하세요</option>
                    <option value="강아지">강아지</option>
                    <option value="고양이">고양이</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">반려동물 나이</label>
                  <select
                    value={formData.petAge}
                    onChange={(e) => setFormData({...formData, petAge: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택하세요</option>
                    <option value="0-2세">0-2세</option>
                    <option value="3-6세">3-6세</option>
                    <option value="7세 이상">7세 이상</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상담 내용</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="궁금한 점이나 상담 내용을 적어주세요"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-105"
              >
                {submitting ? '⏳ 처리 중...' : '📋 리포트 신청하기'}
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm mb-4">
                  아래 AI 챗봇에서 24시간 실시간 전문가 상담을 받으실 수 있습니다 💬
                </p>
                <p className="text-gray-500 text-xs bg-gray-50 p-4 rounded-lg">
                  본 페이지는 특정 보험 상품의 권유가 아닌, 반려견 양육 비용 최적화를 위한 정보 제공 및 전문가 연결 서비스를 목적으로 합니다.<br/>
                  상세 보장 내용은 개별 보험사 약관을 확인하시기 바랍니다.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">🐾 PetCare+</h3>
              <p className="text-gray-400">
                대한민국 No.1 AI 기반<br />펫보험 비교 플랫폼
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">🤖 AI 상담사</h4>
              <p className="text-gray-400">PetCare+ AI Assistant</p>
              <p className="text-gray-400">Claude AI 기반</p>
              <p className="text-gray-400">24시간 실시간 응답</p>
              <p className="text-blue-400 block mt-2 text-sm">
                💬 아래 챗봇에서 바로 상담 가능
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">고객 지원</h4>
              <p className="text-gray-400">💬 위의 AI 챗봇 이용</p>
              <p className="text-gray-400">📋 상담 신청 폼 작성</p>
              <p className="text-gray-400 mt-2 text-sm">24시간 내 답변</p>
              <p className="text-gray-400">수인AI브릿지</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="text-center mb-4">
              <a
                href="/documents/PetCare+_사업계획서.pptx"
                download
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
              >
                📥 정부 정책자금 신청 사업계획서 다운로드
              </a>
            </div>
            <p className="text-center text-gray-500">© 2026 PetCare+ | 수인AI브릿지 | 사업자등록번호: 151-09-03201 | 📞 010-5650-0670</p>
            <p className="text-center text-gray-600 text-xs mt-2">본 페이지는 특정 보험 상품의 권유가 아닌, 정보 제공 및 전문가 연결 서비스를 목적으로 합니다.</p>
          </div>
        </div>
      </footer>

      {/* AI 챗봇 */}
      <ChatBot />
    </div>
  );
}

export default App;
