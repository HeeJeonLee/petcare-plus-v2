// api/kakao-chatbot.js
// 카카오 i 오픈빌더 챗봇 Webhook 엔드포인트
// 카카오톡 채널에서 들어오는 메시지를 Claude AI로 처리

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 카카오 오픈빌더 요청 형식
    const { userRequest } = req.body;
    const userMessage = userRequest?.utterance || '';
    const userId = userRequest?.user?.id || 'unknown';

    if (!userMessage) {
      return res.status(200).json(buildKakaoResponse('안녕하세요! 펫보험 궁금한 점을 물어보세요 🐾'));
    }

    // Claude API로 AI 응답 생성
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (ANTHROPIC_API_KEY) {
      try {
        const aiResponse = await getAIResponse(userMessage, ANTHROPIC_API_KEY);
        return res.status(200).json(buildKakaoResponse(aiResponse));
      } catch (aiError) {
        console.error('Claude API 오류:', aiError);
        // AI 실패 시 키워드 기반 폴백
        const fallback = getFallbackResponse(userMessage);
        return res.status(200).json(buildKakaoResponse(fallback));
      }
    }

    // API 키 없으면 키워드 기반 응답
    const fallback = getFallbackResponse(userMessage);
    return res.status(200).json(buildKakaoResponse(fallback));

  } catch (error) {
    console.error('카카오 챗봇 오류:', error);
    return res.status(200).json(
      buildKakaoResponse('죄송합니다, 일시적 오류가 발생했어요. 잠시 후 다시 시도해주세요! 📞 직접 상담: 010-5650-0670')
    );
  }
}

// Claude API 호출
async function getAIResponse(userMessage, apiKey) {
  const systemPrompt = `당신은 25년 경력의 펫보험 전문 상담사 "이희전"입니다.
PetCare+ (petcareplus.kr) 플랫폼의 AI 상담사입니다.

**대화 규칙:**
- 카카오톡 대화이므로 짧고 친근하게 (최대 300자)
- 이모지 적절히 사용
- 한 번에 2-3문장 이내
- 전문 용어는 쉽게 풀어서
- 상담 신청 유도: petcareplus.kr 또는 010-5650-0670

**8개사 보험 핵심 정보:**
- 메리츠(펫퍼민트): 점유율1위, 자동청구, 월25,000원
- 삼성(위풍댕댕): 다견10%할인, 치과특화, 월28,000원
- 현대(굿앤굿): 100%보장, 가성비, 월26,000원
- KB(금쪽같은펫): MRI/CT최고, 대형견추천, 월30,000원
- DB(프로미라이프): 슬개골특화, 12세가입, 월23,000원
- 한화(댕댕이): 실속형, 월22,000원
- 농협(지킴이펫): 배상책임특화, 월26,000원
- 롯데: 기본보장, 월24,000원

**견종별 추천:**
- 소형견(말티즈,포메,치와와): DB, 메리츠 (슬개골)
- 대형견(리트리버): KB, 현대 (MRI/CT)
- 다견 가정: 삼성 (10% 할인)`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// 카카오 오픈빌더 응답 형식
function buildKakaoResponse(text) {
  // 카카오 응답에 상담 버튼 추가
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: text
          }
        }
      ],
      quickReplies: [
        {
          messageText: '보험료 얼마인가요?',
          action: 'message',
          label: '💰 보험료 문의'
        },
        {
          messageText: '우리 아이에게 맞는 보험 추천해주세요',
          action: 'message',
          label: '🎯 맞춤 추천'
        },
        {
          messageText: '상담사 연결해주세요',
          action: 'message',
          label: '📞 전문가 상담'
        }
      ]
    }
  };
}

// 키워드 기반 폴백 응답
function getFallbackResponse(input) {
  const msg = input.toLowerCase();

  // 견종 매칭
  const breeds = {
    '말티즈': { risks: '슬개골, 치과', recommend: 'DB(월23,000원), 메리츠(월25,000원)' },
    '포메라니안': { risks: '슬개골, 심장', recommend: 'DB, 메리츠' },
    '포메': { risks: '슬개골, 심장', recommend: 'DB, 메리츠' },
    '푸들': { risks: '슬개골, 치과', recommend: 'DB, 삼성' },
    '리트리버': { risks: '고관절, MRI/CT', recommend: 'KB(월30,000원), 현대(월26,000원)' },
    '골든': { risks: '고관절, MRI/CT', recommend: 'KB, 현대' },
    '비글': { risks: '디스크, 귀질환', recommend: '현대, 메리츠' },
    '치와와': { risks: '슬개골, 심장', recommend: 'DB, 메리츠' },
    '시츄': { risks: '눈질환, 피부', recommend: '메리츠, 현대' },
    '요크셔': { risks: '슬개골, 치과', recommend: 'DB, 삼성' },
    '고양이': { risks: '비뇨기, 심장', recommend: '메리츠, 현대' }
  };

  for (const [breed, info] of Object.entries(breeds)) {
    if (msg.includes(breed)) {
      return `${breed} 키우시는군요! 🐾\n\n${breed}는 ${info.risks} 질환을 특히 조심해야 해요.\n추천 보험: ${info.recommend}\n\n자세한 비교는 petcareplus.kr 에서 확인하세요! 😊`;
    }
  }

  // 보험료 문의
  if (msg.includes('보험료') || msg.includes('얼마') || msg.includes('가격') || msg.includes('비용')) {
    return '3세 기준 월 보험료예요 💰\n\n한화 22,000원 (최저)\nDB 23,000원\n롯데 24,000원\n메리츠 25,000원\n현대/농협 26,000원\n삼성 28,000원\nKB 30,000원 (보장 최고)\n\n나이와 견종에 따라 달라져요. 반려동물 정보 알려주시면 맞춤 안내해드릴게요! 🐾';
  }

  // 추천 요청
  if (msg.includes('추천') || msg.includes('어떤') || msg.includes('뭐가 좋')) {
    return '맞춤 추천해드릴게요! 🎯\n\n견종과 나이를 알려주시면 딱 맞는 보험을 추천해드려요.\n\n예: "말티즈 3살" 이렇게요!\n\n또는 petcareplus.kr 에서 AI 맞춤 추천을 받아보세요 😊';
  }

  // 상담 요청
  if (msg.includes('상담') || msg.includes('신청') || msg.includes('가입') || msg.includes('연락')) {
    return '네! 전문 상담 도와드릴게요 😊\n\n📞 전화: 010-5650-0670\n🌐 온라인: petcareplus.kr\n📧 이메일: hejunl@hanmail.net\n\n25년 경력 이희전 상담사가 직접 상담해드려요!\n무료 상담이니 편하게 연락주세요 🐾';
  }

  // 슬개골
  if (msg.includes('슬개골')) {
    return '슬개골 걱정이시군요 😊\n\n소형견은 슬개골이 정말 중요해요!\n- 면책기간: 가입 후 1년\n- 추천 보험: DB(슬개골 특화), 메리츠\n- 중요: 한 살이라도 어릴 때 가입!\n\n자세한 상담은 010-5650-0670 으로 연락주세요 🐾';
  }

  // 인사
  if (msg.includes('안녕') || msg.includes('반가') || msg.includes('하이') || msg.includes('ㅎㅇ')) {
    return '안녕하세요! 😊 PetCare+ 펫보험 AI 상담사예요.\n\n25년 경력 전문가가 도와드릴게요!\n\n어떤 반려동물 키우세요? 견종이랑 나이 알려주시면 딱 맞는 보험 추천해드릴게요 🐾';
  }

  // 기본 응답
  return '펫보험 궁금한 점 편하게 물어보세요! 😊\n\n이런 질문이 가능해요:\n- "말티즈 3살 키워요"\n- "보험료 얼마인가요?"\n- "슬개골 보장되나요?"\n\n자세한 비교: petcareplus.kr\n전화 상담: 010-5650-0670 🐾';
}
