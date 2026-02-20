import { useState } from 'react';
import AIRecommendation from './components/AIRecommendation';
import InsuranceComparison from './components/InsuranceComparison';
import HospitalFinder from './components/HospitalFinder';
import ClaimProcess from './components/ClaimProcess';
import ChatBot from './components/ChatBot';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const supabaseUrl = 'https://cpejxivbyvlpkmthgwfq.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // 1단계: Supabase DB 저장
      let dbSaved = false;
      if (supabaseKey) {
        const dbRes = await fetch(`${supabaseUrl}/rest/v1/consultant_inquiries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            pet_type: formData.petType,
            pet_age: formData.petAge,
            message: formData.message,
            consultant_code: '251220019'
          })
        });
        dbSaved = dbRes.ok || dbRes.status === 201;
      }

      // 2단계: 이메일 발송 API 호출
      try {
        await fetch('/api/send-email', {
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
      } catch (emailErr) {
        console.error('이메일 발송 오류 (무시):', emailErr);
        // 이메일 실패해도 신청은 완료 처리
      }

      // 성공 처리
      alert('✅ 상담 신청이 완료되었습니다!\n\n24시간 내 전문 상담사가 연락드리겠습니다.\n\n감사합니다! 🐾');
      setFormData({ name: '', phone: '', email: '', petType: '', petAge: '', message: '' });

    } catch (error) {
      console.error('상담 신청 오류:', error);
      alert('📞 전화로 상담 신청해주세요!\n\n010-5650-0670\n\n(평일 09:00-18:00)');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl transform hover:scale-105"
            >
              🎯 AI 맞춤 추천 받기
            </a>
            <a
              href="#comparison"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              📊 8개사 상세 비교
            </a>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold text-xl mb-2">AI 맞춤 추천</h3>
              <p className="opacity-90">우리 아이 정보 입력하면 AI가 최적 보험 추천</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-xl mb-2">8개사 상세 비교</h3>
              <p className="opacity-90">메리츠, 삼성, 현대, KB, DB, 한화, 농협, 롯데</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <h3 className="font-bold text-xl mb-2">25년 경력 전문가</h3>
              <p className="opacity-90">미래에셋 소속 펫보험 전문 상담사</p>
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
              📞 전문가 상담 신청
            </h2>
            <p className="text-xl text-gray-600">
              25년 경력 펫보험 전문가가 직접 상담해드립니다
            </p>
            <div className="mt-4 inline-block px-6 py-3 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
              ✨ 무료 상담 · 비대면 가능 · 24시간 내 연락
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
                {submitting ? '⏳ 처리 중...' : '📋 상담 신청하기'}
              </button>

              <div className="text-center">
                <p className="text-gray-500 text-sm">또는 직접 전화 상담</p>
                <a href="tel:010-5650-0670" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                  📞 010-5650-0670
                </a>
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
              <h4 className="font-bold mb-4">전문 상담사</h4>
              <p className="text-gray-400">이희전 상담사</p>
              <p className="text-gray-400">미래에셋금융서비스</p>
              <p className="text-gray-400">경력 25년</p>
              <a href="tel:010-5650-0670" className="text-blue-400 hover:text-blue-300 block mt-1">
                📞 010-5650-0670
              </a>
            </div>
            <div>
              <h4 className="font-bold mb-4">연락처</h4>
              <a href="mailto:hejunl@hanmail.net" className="text-gray-400 hover:text-white block">
                📧 hejunl@hanmail.net
              </a>
              <p className="text-gray-400 mt-2">수인AI브릿지</p>
              <p className="text-gray-400">수원시 팔달구</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© 2025 PetCare+ | 수인AI브릿지 | 사업자등록번호: 119-13-49535</p>
          </div>
        </div>
      </footer>

      {/* AI 챗봇 */}
      <ChatBot />
    </div>
  );
}

export default App;
