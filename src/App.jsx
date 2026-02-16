import { useState } from 'react';
import AIRecommendation from './components/AIRecommendation';
import InsuranceComparison from './components/InsuranceComparison';
import HospitalFinder from './components/HospitalFinder';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Supabase에 저장 (랜딩페이지와 동일한 로직)
    try {
      const response = await fetch('https://cpejxivbyvlpkmthgwfq.supabase.co/rest/v1/consultant_inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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

      if (response.ok) {
        alert('✅ 무료 상담 신청이 완료되었습니다!\n\n24시간 내 전문 상담사가 연락드리겠습니다.\n\n감사합니다! 🐾');
        setFormData({
          name: '',
          phone: '',
          email: '',
          petType: '',
          petAge: '',
          message: ''
        });
      } else {
        throw new Error('저장 실패');
      }
    } catch (error) {
      console.error('상담 신청 오류:', error);
      alert('❌ 상담 신청 중 오류가 발생했습니다.\n\n다시 시도해주시거나\n전화로 문의해주세요: 010-5650-0670');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
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

      {/* 무료 상담 신청 */}
      <section id="contact" className="py-20 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              📞 무료 전문가 상담 신청
            </h2>
            <p className="text-xl text-gray-600">
              25년 경력 펫보험 전문가가 직접 상담해드립니다
            </p>
            <div className="mt-4 inline-block px-6 py-3 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
              ✨ 100% 무료 상담 · 비대면 가능 · 24시간 내 연락
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 *
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 *
                  </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    반려동물 종류
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    반려동물 나이
                  </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상담 내용
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="궁금하신 점이나 걱정되는 질병 등을 자유롭게 적어주세요"
                />
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 상담 프로세스:</strong><br />
                  1️⃣ 상담 신청<br />
                  2️⃣ 24시간 내 전문가 연락<br />
                  3️⃣ 맞춤 상담 & 보험 추천<br />
                  4️⃣ 원하시면 비대면 가입 진행<br />
                  5️⃣ 본인인증 후 최종 완료
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-xl"
              >
                📞 무료 상담 신청하기
              </button>

              <p className="text-center text-sm text-gray-500">
                전문가 상담 후 최적의 보험을 추천받으세요<br />
                상담은 완전 무료이며, 가입 여부는 자유롭게 결정하실 수 있습니다
              </p>
            </form>
          </div>

          {/* 상담사 정보 */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl">
                👨‍💼
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  펫보험 전문 상담사
                </h3>
                <p className="text-gray-600 mb-3">
                  미래에셋금융서비스 소속 · 25년 경력 · 상담사 코드: 251220019
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    ✅ 8개사 제휴
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    ✅ 비대면 가능
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    ✅ 100% 무료
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">직접 연락</p>
                <a
                  href="tel:010-5650-0670"
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  📞 010-5650-0670
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🐾 PetCare+</h3>
              <p className="text-gray-400">
                대한민국 최고의 AI 기반<br />
                펫보험 비교 및 상담 플랫폼
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">제휴 보험사 (8개)</h4>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>• 메리츠화재 펫퍼민트</li>
                <li>• 삼성화재 애니펫</li>
                <li>• 현대해상 굿앤굿우리펫</li>
                <li>• KB손해보험 금쪽같은펫</li>
                <li>• DB손해보험 펫블리</li>
                <li>• 한화손해보험 댕댕이</li>
                <li>• NH농협 지킴이펫</li>
                <li>• 롯데/하나손해보험</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">운영사</h4>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li>상호: 수인AI브릿지</li>
                <li>사업자번호: 119-13-49535</li>
                <li>대표: 이희전</li>
                <li>제휴: 미래에셋금융서비스</li>
                <li>상담사 코드: 251220019</li>
                <li>이메일: <a href="mailto:hejunl@hanmail.net" className="hover:text-blue-400 transition-colors">hejunl@hanmail.net</a></li>
                <li>전화: <a href="tel:010-5650-0670" className="hover:text-blue-400 transition-colors">010-5650-0670</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 PetCare+ by 수인AI브릿지. All rights reserved.</p>
            <p className="mt-2">
              본 플랫폼은 펫보험 비교 및 상담 서비스를 제공하며,
              실제 보험 계약은 각 보험사와 직접 체결됩니다.
            </p>
          </div>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBot consultantName="펫보험 전문 상담사" consultantCode="251220019" />

      {/* PWA 설치 안내 (모바일) */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
