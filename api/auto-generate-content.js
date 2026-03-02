/**
 * 🤖 자동 콘텐츠 생성 API
 * Claude API를 이용해 블로그, SNS, 뉴스레터 자동 생성
 */

import Anthropic from "@anthropic-ai/sdk";
import supabaseAdmin from "./supabaseAdmin.js";

const client = new Anthropic();

/**
 * 📝 블로그 포스트 자동 생성
 */
export async function generateBlogPost() {
  try {
    console.log("🚀 블로그 포스트 생성 시작...");

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `펫보험 전문가로서 2024-2026년 한국 펫보험 시장에 대한 최신 블로그 포스트를 작성해주세요.

요구사항:
1. 제목: SEO 최적화된 한글 제목 (최대 60자)
2. 본문: 1500-2000자의 전문적인 내용
3. 구조: 소개 → 시장 현황 → 보험사 비교 → 선택 팁 → 결론
4. 어조: 친근하지만 전문적
5. 포함사항: 메리츠, 삼성, DB, 현대, KB, 한화, 농협, 롯데 중 최소 3개사

JSON 형식으로 반환:
{
  "title": "제목",
  "slug": "url-friendly-slug",
  "category": "펫보험",
  "content": "본문 내용",
  "summary": "150자 요약",
  "seoKeywords": ["키워드1", "키워드2", "키워드3"],
  "authorNote": "추가 설명"
}`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // JSON 추출
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON 형식 응답을 찾을 수 없습니다');
    }

    const blogData = JSON.parse(jsonMatch[0]);
    console.log("✅ 블로그 생성 완료:", blogData.title);

    return {
      type: 'blog',
      ...blogData,
      generatedAt: new Date().toISOString(),
      status: 'published'
    };
  } catch (err) {
    console.error('❌ 블로그 생성 실패:', err);
    throw err;
  }
}

/**
 * 📱 SNS 콘텐츠 자동 생성
 */
export async function generateSNSContent() {
  try {
    console.log("🚀 SNS 콘텐츠 생성 시작...");

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `펫보험 마케팅 전문가로서 다양한 SNS 플랫폼용 콘텐츠를 생성해주세요.

각 플랫폼별 요구사항:
- Instagram (선택사항): #해시태그 5개, 최대 2200자, 이모지 활용
- Twitter: 최대 280자, 리트윗 유도, 링크 포함
- Facebook: 1000자, 대화체, 댓글 유도

JSON 형식:
{
  "instagram": {
    "content": "콘텐츠",
    "hashtags": ["tag1", "tag2"],
    "emojiCount": 5,
    "callToAction": "클릭 유도 문구"
  },
  "twitter": {
    "content": "콘텐츠",
    "hashtags": ["tag1"],
    "link": "https://petcare-plus.vercel.app"
  },
  "facebook": {
    "content": "콘텐츠",
    "imageDescription": "추천 이미지 설명",
    "engagement": "댓글 유도 문구"
  }
}`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON 형식 응답을 찾을 수 없습니다');
    }

    const snsData = JSON.parse(jsonMatch[0]);
    console.log("✅ SNS 콘텐츠 생성 완료");

    return {
      type: 'sns',
      ...snsData,
      generatedAt: new Date().toISOString(),
      status: 'published'
    };
  } catch (err) {
    console.error('❌ SNS 콘텐츠 생성 실패:', err);
    throw err;
  }
}

/**
 * 📧 뉴스레터 자동 생성
 */
export async function generateNewsletter() {
  try {
    console.log("🚀 뉴스레터 생성 시작...");

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2500,
      messages: [
        {
          role: "user",
          content: `펫보험 뉴스레터 에디터로서 주간 뉴스레터를 작성해주세요.

구성:
1. 주제: 이번주 펫보험 핫이슈 (실제 기반)
2. 헤더: 시즌별 추천 (봄 = 질병 예방)
3. 섹션 3개:
   - 보험사 뉴스 (1개 회사)
   - 펫의료 트렌드
   - 독자 추천 팁
4. 푸터: CTA + 구독 해지 링크

JSON 형식:
{
  "title": "뉴스레터 제목",
  "subject": "이메일 제목 (최대 50자)",
  "seasonalTopic": "현재 계절 주제",
  "sections": [
    {"title": "섹션명", "content": "내용"}
  ],
  "callToAction": "클릭 유도",
  "estimatedReadTime": "3분"
}`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON 형식 응답을 찾을 수 없습니다');
    }

    const newsletterData = JSON.parse(jsonMatch[0]);
    console.log("✅ 뉴스레터 생성 완료:", newsletterData.title);

    return {
      type: 'newsletter',
      ...newsletterData,
      generatedAt: new Date().toISOString(),
      status: 'published'
    };
  } catch (err) {
    console.error('❌ 뉴스레터 생성 실패:', err);
    throw err;
  }
}

/**
 * 🔄 모든 콘텐츠 생성 (통합)
 */
export async function generateAllContent() {
  try {
    console.log("🚀 모든 콘텐츠 생성 시작...");

    const results = {};

    // 1. 블로그
    try {
      results.blog = await generateBlogPost();
    } catch (err) {
      console.error('블로그 생성 실패:', err.message);
      results.blog = null;
    }

    // 2. SNS
    try {
      results.sns = await generateSNSContent();
    } catch (err) {
      console.error('SNS 생성 실패:', err.message);
      results.sns = null;
    }

    // 3. 뉴스레터
    try {
      results.newsletter = await generateNewsletter();
    } catch (err) {
      console.error('뉴스레터 생성 실패:', err.message);
      results.newsletter = null;
    }

    console.log("✅ 모든 콘텐츠 생성 완료");
    return results;
  } catch (err) {
    console.error('❌ 전체 콘텐츠 생성 실패:', err);
    throw err;
  }
}

// Vercel Cron Job 핸들러
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Vercel Cron Secret 확인 (보안)
    const cronSecret = req.headers['x-vercel-cron-secret'];
    if (cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const contentType = req.query.type || 'all'; // all, blog, sns, newsletter

    let result;
    if (contentType === 'blog') {
      result = await generateBlogPost();
    } else if (contentType === 'sns') {
      result = await generateSNSContent();
    } else if (contentType === 'newsletter') {
      result = await generateNewsletter();
    } else {
      result = await generateAllContent();
    }

    console.log('✅ 콘텐츠 생성 성공:', result);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('❌ 콘텐츠 생성 API 오류:', err);
    res.status(500).json({ error: err.message });
  }
}
