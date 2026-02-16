import { useState, useRef, useEffect } from 'react';

export default function ChatBot({ consultantName = "AI 상담사", consultantCode = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `안녕하세요! 😊 ${consultantName}입니다.

25년 경력의 펫보험 전문가로서 도와드리겠습니다.

어떤 도움이 필요하신가요?
• 보험 상품 추천
• 견종별 맞춤 추천
• 보험료 문의
• 보장 내용 비교
• 가입 절차 안내

편하게 질문해주세요! 🐾`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 8개사 보험 데이터 (간소화)
  const insuranceKnowledge = {
    companies: {
      메리츠: { premium: "25,000원", features: "점유율 1위, 제휴병원 2,000개, 자동 청구", best: "청구 편의성" },
      삼성: { premium: "28,000원", features: "치과 특화, 다견 10% 할인", best: "다견 가정" },
      현대: { premium: "26,000원", features: "100% 보장, 가성비 우수", best: "가성비" },
      KB: { premium: "30,000원", features: "MRI/CT 최고, 고액 치료 대비", best: "대형견, 검사비" },
      DB: { premium: "23,000원", features: "슬개골 특화, 12세까지 가입", best: "소형견, 슬개골" },
      한화: { premium: "22,000원", features: "실속형, 핵심 보장", best: "예산 중시" },
      농협: { premium: "26,000원", features: "배상책임 특화, 장례비용", best: "배상책임" },
      롯데: { premium: "24,000원", features: "기본 보장", best: "제한적" }
    },
    breeds: {
      말티즈: { risks: "슬개골, 치과", recommend: "DB, 메리츠" },
      포메라니안: { risks: "슬개골, 심장", recommend: "DB, 메리츠" },
      푸들: { risks: "슬개골, 치과", recommend: "DB, 삼성" },
      리트리버: { risks: "고관절, MRI/CT", recommend: "KB, 현대" },
      비글: { risks: "디스크, 귀질환", recommend: "현대, 메리츠" },
      치와와: { risks: "슬개골, 심장", recommend: "DB, 메리츠" }
    },
    faq: {
      "보험료": "반려동물 나이에 따라 다릅니다. 3세 기준으로 월 2만원~3만원대입니다.",
      "가입나이": "대부분 만 10세까지 가입 가능하며, DB는 만 12세까지 가능합니다.",
      "슬개골": "가입 후 1년 면책기간이 있습니다. 한 살이라도 어릴 때 가입하세요!",
      "면책기간": "일반 질병은 30일, 슬개골/고관절은 1년 면책기간이 있습니다.",
      "자기부담금": "보험사마다 10~20%입니다. 낮을수록 유리합니다.",
      "MRI": "KB가 업계 최고 한도입니다. 대형견에게 추천드립니다.",
      "다견": "삼성화재가 다견 10% 할인을 제공합니다.",
      "치과": "삼성과 DB가 치과 특약이 강력합니다."
    }
  };

  const generateSystemPrompt = () => {
    return `당신은 25년 경력의 펫보험 전문 상담사입니다. 이름은 ${consultantName}입니다.

**역할:**
- 친근하고 전문적인 펫보험 상담
- 고객의 반려동물 상황에 맞는 맞춤형 추천
- 보험 용어를 쉽게 설명
- 공감하고 배려하는 대화

**상담 스타일:**
- 이모지 적절히 사용 (🐾, 😊, ✅ 등)
- 짧고 명확한 문장
- 고객의 걱정을 먼저 공감
- 구체적인 숫자와 예시 제공

**8개사 보험 정보:**
${JSON.stringify(insuranceKnowledge, null, 2)}

**중요 규칙:**
1. 반려동물 정보를 먼저 파악 (견종, 나이)
2. 걱정되는 질병 확인
3. 예산 범위 확인
4. 2-3개 보험사 추천
5. 추천 이유 명확히 설명
6. 상담 신청 유도

**응답 형식:**
- 공감 → 정보 제공 → 추천 → 다음 질문
- 한 번에 너무 많은 정보 X
- 고객이 이해했는지 확인

**예시:**
고객: "말티즈 3살 키워요"
상담사: "말티즈 3살이시군요! 🐾 정말 사랑스러운 나이네요 😊

말티즈는 슬개골 탈구와 치과 질환을 조심해야 해요.

추천드리는 보험은:
1. DB 프로미라이프 (월 23,000원)
   - 슬개골 특화
   - 치과 특약 강력
   
2. 메리츠 펫퍼민트 (월 25,000원)
   - 업계 1위 안정성
   - 청구 편의성 최고

혹시 특별히 걱정되는 질병이 있으신가요?"

이런 식으로 자연스럽고 전문적으로 상담하세요.`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Claude API 호출
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: generateSystemPrompt(),
          messages: messages
            .filter(m => m.role !== 'system')
            .concat([userMessage])
            .map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('챗봇 오류:', error);
      
      // 폴백: 키워드 기반 응답
      const fallbackResponse = generateFallbackResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
    }

    setLoading(false);
  };

  const generateFallbackResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // 견종 인식
    for (const [breed, info] of Object.entries(insuranceKnowledge.breeds)) {
      if (input.includes(breed)) {
        return `${breed}를 키우시는군요! 🐾

${breed}는 주로 ${info.risks} 질환을 조심해야 해요.

추천 보험사: ${info.recommend}

더 자세한 상담이 필요하시면 아래 '무료 상담 신청'을 눌러주세요! 😊`;
      }
    }
    
    // FAQ 응답
    for (const [keyword, answer] of Object.entries(insuranceKnowledge.faq)) {
      if (input.includes(keyword)) {
        return `${answer}

더 궁금하신 점 있으시면 편하게 질문해주세요! 😊`;
      }
    }
    
    // 인사
    if (input.includes('안녕') || input.includes('반가')) {
      return `안녕하세요! 😊 반가워요!

펫보험에 대해 궁금하신 게 있으신가요?

• 어떤 반려동물을 키우시나요?
• 나이는 어떻게 되나요?
• 걱정되는 질병이 있으신가요?

알려주시면 맞춤 추천해드릴게요! 🐾`;
    }
    
    // 가격 문의
    if (input.includes('가격') || input.includes('보험료') || input.includes('얼마')) {
      return `보험료는 반려동물 나이에 따라 달라져요! 💰

3세 기준 월 보험료:
• DB: 23,000원 (가장 저렴)
• 한화: 22,000원
• 현대: 26,000원
• 메리츠: 25,000원
• KB: 30,000원 (보장 최고)

반려동물 나이를 알려주시면 정확한 견적 드릴게요! 😊`;
    }
    
    // 추천 요청
    if (input.includes('추천') || input.includes('어떤') || input.includes('뭐가')) {
      return `맞춤 추천을 위해 몇 가지 알려주세요! 🎯

1. 반려동물 종류: 강아지? 고양이?
2. 견종/묘종: 말티즈, 푸들, 리트리버 등
3. 나이: 몇 살인가요?
4. 걱정되는 질병: 슬개골, 치과 등

알려주시면 딱 맞는 보험 추천해드릴게요! 🐾`;
    }
    
    // 상담 신청
    if (input.includes('상담') || input.includes('신청') || input.includes('가입')) {
      return `네! 전문 상담사와 연결해드릴게요! 📞

아래 '무료 상담 신청' 버튼을 눌러주시면
24시간 내 연락드리겠습니다!

• 전화 상담
• 비대면 가입 가능
• 완전 무료

궁금하신 점 더 있으시면 말씀해주세요! 😊`;
    }
    
    // 기본 응답
    return `음... 질문을 잘 이해하지 못했어요 😅

이렇게 질문해주시면 도움드릴게요:
• "말티즈 3살 키워요"
• "보험료 얼마인가요?"
• "슬개골 보장되나요?"
• "추천 보험 알려주세요"

또는 아래 '무료 상담 신청'으로
전문 상담사와 연결하세요! 📞`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "말티즈 보험 추천",
    "보험료 얼마인가요?",
    "슬개골 보장되나요?",
    "다견 할인 있나요?"
  ];

  return (
    <>
      {/* 챗봇 버튼 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all z-50 group animate-bounce"
        >
          <div className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </div>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            AI 상담사와 채팅하기
          </div>
        </button>
      )}

      {/* 챗봇 창 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                  🐾
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold">{consultantName}</h3>
                <p className="text-xs opacity-90">25년 경력 펫보험 전문가</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 빠른 질문 */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-white border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">💡 빠른 질문:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(q);
                      setTimeout(handleSend, 100);
                    }}
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 입력 영역 */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-3 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Enter로 전송 • 전문 상담은 무료 상담 신청
            </p>
          </div>
        </div>
      )}
    </>
  );
}
