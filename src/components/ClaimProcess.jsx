export default function ClaimProcess() {
  const steps = [
    {
      step: '01',
      icon: '🏥',
      title: '동물병원 치료',
      desc: '반려동물이 다치거나 아파서 동물병원에서 치료를 받습니다.',
      detail: '진료비 영수증, 진단서, 진료기록부 반드시 챙기기',
      color: 'from-blue-500 to-blue-600'
    },
    {
      step: '02',
      icon: '📋',
      title: '서류 준비',
      desc: '보험금 청구에 필요한 서류를 준비합니다.',
      detail: '① 진료비 영수증 ② 진단서 ③ 진료기록부 ④ 통장사본',
      color: 'from-purple-500 to-purple-600'
    },
    {
      step: '03',
      icon: '📱',
      title: '보험금 청구 접수',
      desc: '보험사 앱 또는 고객센터를 통해 보험금을 청구합니다.',
      detail: '앱 청구(간편) 또는 팩스/우편 접수 · 대부분 앱으로 5분 완료',
      color: 'from-green-500 to-green-600'
    },
    {
      step: '04',
      icon: '🔍',
      title: '심사 진행',
      desc: '보험사에서 청구 서류를 검토하고 심사합니다.',
      detail: '일반 3~5 영업일 · 추가 서류 요청 시 기간 연장 가능',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      step: '05',
      icon: '💰',
      title: '보험금 지급',
      desc: '심사 완료 후 등록된 계좌로 보험금이 입금됩니다.',
      detail: '심사 완료 후 3 영업일 이내 지급 · 문자 안내 발송',
      color: 'from-pink-500 to-red-500'
    }
  ];

  const tips = [
    { icon: '📸', tip: '치료 전 사진 촬영', desc: '치료 전후 상태를 사진으로 기록해두면 청구 시 유리합니다.' },
    { icon: '🗂️', tip: '서류 꼼꼼히 보관', desc: '진료 영수증과 진단서는 분실하지 않도록 사진으로도 저장하세요.' },
    { icon: '⏰', tip: '청구 기한 확인', desc: '대부분 보험사는 치료일로부터 3년 이내 청구 가능합니다.' },
    { icon: '📞', tip: '전문가 도움 받기', desc: '청구 거절 시 전문 상담사의 도움으로 재청구 가능합니다.' }
  ];

  return (
    <section id="claim-process" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4">

        {/* 헤더 */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            💡 PetCare+ 보험금 청구 지원 서비스
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            💰 보험금 청구 프로세스
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            복잡한 보험금 청구, PetCare+가 처음부터 끝까지 도와드립니다
          </p>
        </div>

        {/* ✨ 안내 문구 박스 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 mb-14">
          <h3 className="text-xl font-bold text-blue-800 mb-5 flex items-center gap-2">
            📌 보험금 청구, 이렇게 하시면 됩니다
          </h3>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              반려동물이 갑작스럽게 아프거나 다쳤을 때, 가장 먼저 해야 할 일은
              <span className="font-semibold text-blue-700"> 동물병원에서 치료를 받으면서 관련 서류를 빠짐없이 챙기는 것</span>입니다.
              진료비 영수증, 진단서, 진료기록부는 보험금 청구의 핵심 서류이므로 치료 당일 반드시 수령하세요.
            </p>
            <p>
              서류 준비가 완료되면 <span className="font-semibold text-purple-700">가입한 보험사의 앱 또는 고객센터</span>를 통해 보험금을 청구합니다.
              요즘은 대부분의 보험사가 모바일 앱을 통한 간편 청구를 지원하며,
              사진 촬영 후 업로드하는 방식으로 <span className="font-semibold text-green-700">5~10분 이내에 청구 접수</span>가 가능합니다.
            </p>
            <p>
              청구 후 보험사는 제출된 서류를 바탕으로 심사를 진행하며,
              일반적으로 <span className="font-semibold text-orange-600">3~5 영업일 이내</span>에 심사가 완료됩니다.
              추가 서류가 필요한 경우 보험사로부터 별도 연락이 옵니다.
            </p>
            <p>
              심사가 완료되면 <span className="font-semibold text-pink-600">등록된 계좌로 보험금이 자동 입금</span>되며,
              문자로 지급 완료 안내를 받게 됩니다.
              보험금 지급까지 통상 청구 후 <span className="font-semibold text-red-600">5~7 영업일</span> 정도 소요됩니다.
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-800 font-medium">
                ⚠️ <span className="font-bold">주의사항:</span> 보험 가입 전 발생한 질환(기존 질환)이나 가입 후 면책기간(30일~1년) 내 발생한 특정 질환은
                보험금 지급이 제한될 수 있습니다. 가입 시 약관을 꼼꼼히 확인하시고,
                궁금한 점은 전문 상담사에게 문의하세요.
              </p>
            </div>
          </div>
        </div>

        {/* 5단계 프로세스 */}
        <div className="relative mb-14">
          <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 mx-16 z-0"></div>
          <div className="grid md:grid-cols-5 gap-6 relative z-10">
            {steps.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg mb-4 border-4 border-white`}>
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-gray-400 mb-1">STEP {item.step}</span>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">{item.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{item.desc}</p>
                <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 w-full">
                  <p className="text-xs text-blue-600 font-medium">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 청구 가능 항목 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📋 보험금 청구 가능 항목
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-bold text-blue-800 mb-3">🏥 통원 치료</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ 진찰료 · 처치료</li>
                <li>✅ 검사비 (혈액, X-ray 등)</li>
                <li>✅ 처방 의약품</li>
                <li>✅ 예방접종 (일부 보험)</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-xl p-6">
              <h4 className="font-bold text-purple-800 mb-3">🏨 입원 치료</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ 입원비 · 간호비</li>
                <li>✅ 수술비</li>
                <li>✅ MRI · CT 검사비</li>
                <li>✅ 집중치료실 비용</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-6">
              <h4 className="font-bold text-red-800 mb-3">⚠️ 청구 불가 항목</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>❌ 가입 전 기존 질환</li>
                <li>❌ 면책기간 내 질환</li>
                <li>❌ 미용 목적 시술</li>
                <li>❌ 예방 목적 수술</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 실용 팁 */}
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          {tips.map((item) => (
            <div key={item.tip} className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm">{item.tip}</h4>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA 배너 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            📞 보험금 청구, 혼자 고민하지 마세요!
          </h3>
          <p className="text-lg opacity-90 mb-2">
            청구 거절 또는 삭감 시 전문가가 직접 도와드립니다
          </p>
          <p className="text-sm opacity-75 mb-6">
            25년 경력 펫보험 전문 상담사가 청구 서류 준비부터 지급까지 함께합니다
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              📋 상담 신청하기
            </a>
            <a
              href="tel:010-5650-0670"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              📞 010-5650-0670
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
