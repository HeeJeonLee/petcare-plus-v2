import { useState, useRef, useEffect } from 'react';

export default function ChatBot({ consultantName = "AI 상담사", consultantCode = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `안녕하세요! 😊 ${consultantName}입니다.

미래에셋금융서비스 펫보험 전문 상담사이며, Claude AI를 기반으로 24시간 맞춤 상담을 제공합니다.

우리 아이의 견종, 나이, 건강 상태를 알려주시면 8개 보험사(메리츠, 삼성, 현대, KB, DB, 한화, 농협, 롯데) 중 최적의 상품을 추천해드립니다. 🐾

편하게 물어봐 주세요!`
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

  // 8개사 보험 데이터 (2026년 2월 최신)
  const insuranceKnowledge = {
    companies: {
      메리츠: { premium: "25,000원~35,000원", features: "펫퍼민트 | 점유율 1위, 제휴병원 2,000개, 자동 청구 기능", best: "청구 편의성" },
      삼성: { premium: "28,000원~40,000원", features: "위풍댕댕 | 치과 특화, 다견 10% 할인, 안정적 보상", best: "안정성" },
      현대: { premium: "26,000원~38,000원", features: "굿앤굿 우리아이펫 | 다양한 특약, 넓은 보장범위", best: "가성비" },
      KB: { premium: "30,000원~42,000원", features: "금쪽같은펫보험 | MRI/CT 최고, 고액 치료 대비, 자녀보험 노하우", best: "대형견, 검사비" },
      DB: { premium: "23,000원~33,000원", features: "펫블리 | 슬개골 특화, 담보 강화, 12세까지 가입", best: "소형견, 슬개골" },
      한화: { premium: "22,000원~32,000원", features: "시그니처 펫보험 | 신상품 2026년 출시, 보장범위 대폭 확대", best: "신상품" },
      농협: { premium: "26,000원~36,000원", features: "NH가성비굿펫 | 지역 기반 영업망, 배상책임 특화, 실속형", best: "지역 기반" },
      롯데: { premium: "24,000원~34,000원", features: "let:click 펫보험 | 간편 가입, 온라인/오프라인, 저렴한 보험료", best: "간편성" }
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
    return `당신은 Claude AI 기반의 최고 수준 펫보험 전문 상담사입니다. 이름은 ${consultantName}입니다.

**역할:**
- 친구처럼 편하게 대화하면서도 전문성 있는 상담
- 고객의 반려동물을 진심으로 아끼는 마음으로 대화
- 보험 용어는 쉽게 풀어서 설명
- 공감과 배려를 최우선으로
- 24시간 실시간 응답으로 최고의 경험 제공

**대화 스타일 (매우 중요!):**
- 자연스럽고 편안한 대화 (친구처럼)
- 이모지 적절히 사용 (🐾, 😊, ✅, 💙 등)
- 짧고 간결하게 (한 번에 3-4문장)
- 고객의 감정에 먼저 공감
- 질문은 자연스럽게 대화 흐름 속에서

**절대 하지 말 것:**
❌ "아래 버튼을 클릭하세요" 같은 말 (버튼 없음!)
❌ "무료 상담 신청 버튼을 눌러주세요" (없음!)
❌ 리스트형 답변 (•, -, 1. 2. 등)
❌ 과도하게 긴 설명
❌ 딱딱한 공식적인 말투

**8개사 보험 정보:**
${JSON.stringify(insuranceKnowledge, null, 2)}

**상담 접근법:**
1. 먼저 공감하고 가벼운 대화
2. 자연스럽게 반려동물 정보 파악
3. 한두 가지만 물어보기 (한 번에 많이 X)
4. 보험 추천 시 2개 정도만
5. 더 알고 싶은 게 있는지 물어보기

**대화 예시:**
고객: "말티즈 3살 키워요"
당신: "아 말티즈 3살! 지금 정말 귀여울 나이네요 🐾 이름이 뭐예요?

말티즈는 슬개골이랑 치아 건강을 특히 챙겨줘야 해서요, DB 프로미라이프(월 23,000원)나 메리츠 펫퍼민트(월 25,000원) 정도가 잘 맞을 것 같아요.

혹시 지금 걱정되는 증상 같은 게 있으세요?"

→ 이렇게 친구처럼 편하게 대화하세요!`;
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
        return `${breed}를 키우시는군요! 🐾 정말 사랑스럽죠!

${breed}는 ${info.risks} 질환을 특히 조심해야 해서요, ${info.recommend} 정도가 잘 맞을 것 같아요.

나이나 걱정되는 증상 같은 거 있으세요?`;
      }
    }
    
    // FAQ 응답
    for (const [keyword, answer] of Object.entries(insuranceKnowledge.faq)) {
      if (input.includes(keyword)) {
        return `${answer}

더 궁금한 거 있으면 편하게 물어보세요! 😊`;
      }
    }
    
    // 인사
    if (input.includes('안녕') || input.includes('반가')) {
      return `안녕하세요! 😊 반가워요!

펫보험 알아보시나요? 어떤 반려동물 키우세요? 🐾`;
    }
    
    // 가격 문의
    if (input.includes('가격') || input.includes('보험료') || input.includes('얼마')) {
      return `보험료는 나이에 따라 다른데요, 3세 기준으로 말씀드리면:

DB 23,000원 (가장 저렴), 한화 22,000원, 메리츠 25,000원, 현대 26,000원, KB 30,000원 (보장 제일 좋음) 정도예요.

반려동물 나이가 어떻게 되세요? 😊`;
    }
    
    // 추천 요청
    if (input.includes('추천') || input.includes('어떤') || input.includes('뭐가')) {
      return `맞춤 추천해드릴게요! 🎯

강아지인가요 고양이인가요? 그리고 견종이랑 나이 알려주시면 딱 맞는 보험 추천해드릴게요!`;
    }
    
    // 상담 신청
    if (input.includes('상담') || input.includes('신청') || input.includes('가입')) {
      return `네! 좋아요 😊

페이지 아래쪽에 무료 상담 신청 폼이 있어요. 거기에 연락처 남겨주시면 24시간 내로 제가 전화드릴게요!

전화 상담도 되고 비대면 가입도 가능하니까 편한 방법으로 진행하시면 돼요 👍`;
    }
    
    // 기본 응답
    return `음... 뭘 여쭤보시는 건지 정확히 못 알아들었어요 😅

이런 식으로 물어보시면 도움드릴 수 있어요:
"말티즈 3살 키워요" 이런 식으로 말씀해주시거나, "보험료 얼마예요?" "슬개골 보장되나요?" 같이 물어보시면 돼요!`;
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
                <p className="text-xs opacity-90">Claude AI 24시간 상담</p>
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
