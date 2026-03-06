// api/blog-generate.js
// 네이버 블로그용 AI 글쓰기 보조 API
// Claude AI로 펫보험 관련 블로그 글 초안 생성

export default async function handler(req, res) {
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
    const { topic, style, keywords } = req.body;

    if (!topic) {
      return res.status(400).json({ error: '주제를 입력해주세요' });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API 키가 설정되지 않았습니다' });
    }

    const systemPrompt = `당신은 네이버 블로그 SEO 전문 글쓰기 도우미입니다.
펫보험 전문 블로거 "이희전" (25년 경력 보험 컨설턴트)의 블로그 글을 작성합니다.

**글쓰기 규칙:**
1. 네이버 블로그 최적화 (SEO)
   - 제목에 핵심 키워드 포함
   - 본문 첫 문단에 키워드 자연스럽게 삽입
   - 소제목(##)으로 가독성 확보
   - 글 길이: 1500~2500자 (네이버 최적)

2. 톤앤매너
   - 친근하면서 전문적
   - 경험 기반 이야기 (25년 경력 활용)
   - 독자가 공감할 수 있는 사례 포함
   - 이모지 적절히 사용

3. 구조
   - 제목 (SEO 키워드 포함)
   - 도입부 (공감, 문제 제기)
   - 본문 (정보, 비교, 팁)
   - 마무리 (요약, CTA)
   - 해시태그 10개

4. PetCare+ 홍보 자연스럽게 삽입
   - 사이트: petcareplus.kr
   - 전화: 010-5650-0670
   - "무료 상담" 언급

5. 절대 하지 말 것
   - 허위/과장 정보
   - 특정 보험사 비하
   - 보험 가입 강요
   - 의학적 조언 (수의사 권장)

**8개 펫보험사 정보:**
- 메리츠 펫퍼민트: 점유율 1위, 자동청구, 제휴병원 2,000개
- 삼성 위풍댕댕: 다견 10% 할인, 치과 특화
- 현대 굿앤굿: 100% 보장, 가성비
- KB 금쪽같은펫: MRI/CT 최고 한도
- DB 프로미라이프: 슬개골 특화, 12세 가입
- 한화 댕댕이: 실속형
- 농협 지킴이펫: 배상책임 특화
- 롯데: 기본 보장`;

    const userPrompt = `주제: ${topic}
스타일: ${style || '정보성 + 친근한'}
키워드: ${keywords || '자동 생성'}

위 주제로 네이버 블로그 글을 작성해주세요.
마크다운이 아닌 일반 텍스트로 작성하되, 소제목은 ■ 기호로 구분해주세요.
해시태그는 글 마지막에 #키워드 형식으로 10개 작성해주세요.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API 오류:', errorData);
      return res.status(500).json({ error: 'AI 글 생성 실패' });
    }

    const data = await response.json();
    const generatedContent = data.content[0].text;

    return res.status(200).json({
      success: true,
      content: generatedContent,
      topic,
      style: style || '정보성 + 친근한',
      keywords: keywords || '자동 생성'
    });

  } catch (error) {
    console.error('블로그 생성 오류:', error);
    return res.status(500).json({ error: '서버 오류 발생' });
  }
}
