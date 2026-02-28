/**
 * PetCare+ Content Generator
 * Autonomous blog and SNS content creation using Claude AI
 */

class ContentGenerator {
  constructor() {
    this.enabled = import.meta.env.VITE_CONTENT_GENERATION_ENABLED === 'true';
    this.blogFrequency = import.meta.env.VITE_BLOG_POST_FREQUENCY || 'daily';
    this.snsFrequency = import.meta.env.VITE_SNS_POST_FREQUENCY || 'hourly';
    this.language = import.meta.env.VITE_CONTENT_LANGUAGE || 'ko';
    this.generatedContent = [];
  }

  /**
   * Generate blog post about pet insurance
   */
  async generateBlogPost(topic = null) {
    if (!this.enabled) return null;

    const topics = [
      "펫보험 가입 시 주의할 사항",
      "반려견 슬개골 탈구 예방 가이드",
      "새해, 반려동물 건강검진 계획",
      "펫보험으로 준비하는 응급상황",
      "반려견 치과 질환과 보험 보장",
      "고양이 주인이 알아야 할 펫보험 정보",
      "펫보험 갱신 시 놓치지 말 것",
      "반려동물 수술비, 얼마나 준비해야 할까?",
      "펫보험 비교할 때 체크리스트",
      "나이별 반려동물 건강 관리와 보험"
    ];

    const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];

    const prompt = `
당신은 펫보험 전문 블로거입니다. 다음 주제로 한국어 블로그 글을 작성해주세요:

제목: ${selectedTopic}

요구사항:
1. 1500-2000자의 상세한 글
2. 실용적인 정보와 조언 포함
3. PetCare+ 플랫폼의 서비스를 자연스럽게 소개
4. 마지막에 "더 자세한 내용은 PetCare+ 앱에서 확인하세요"라는 CTA 추가
5. 이모지를 적절히 사용하여 가독성 향상
6. 리스트나 소제목으로 구조화

JSON 형식으로 다음을 포함해서 응답해주세요:
{
  "title": "제목",
  "slug": "url-slug",
  "content": "본문 내용",
  "summary": "요약(100자)",
  "keywords": ["키워드1", "키워드2", ...],
  "category": "카테고리",
  "image_prompt": "이미지 생성용 프롬프트",
  "cta": "클릭 유도 문구"
}
    `;

    return await this.callClaudeAPI(prompt, 'blog_post');
  }

  /**
   * Generate SNS content (Instagram, Twitter, etc.)
   */
  async generateSNSContent(platform = 'instagram') {
    if (!this.enabled) return null;

    const snsTopics = [
      "펫보험 가입 팁",
      "반려동물 건강 상식",
      "펫보험 실제 사례",
      "반려동물과의 일상",
      "펫보험 비교 정보",
      "응급상황 대처법"
    ];

    const topic = snsTopics[Math.floor(Math.random() * snsTopics.length)];

    const platformGuides = {
      instagram: "해시태그 10-15개 포함, 이모지 사용, 300자 이내",
      twitter: "280자 이내, 명확한 메시지",
      tiktok: "트렌디한 톤, 해시태그 포함",
      facebook: "캐주얼하고 친근한 톤, 300-500자"
    };

    const prompt = `
당신은 펫보험 분야의 SNS 마케팅 전문가입니다.

${platform} 플랫폼용 마케팅 콘텐츠를 만들어주세요:

주제: ${topic}
가이드: ${platformGuides[platform] || platformGuides.instagram}

JSON 형식으로 응답:
{
  "platform": "${platform}",
  "content": "게시물 텍스트",
  "hashtags": ["해시태그1", "해시태그2", ...],
  "emoji": "🐾",
  "cta": "클릭 유도 문구",
  "image_prompt": "이미지 생성 프롬프트",
  "best_posting_time": "HH:mm"
}
    `;

    return await this.callClaudeAPI(prompt, 'sns_post');
  }

  /**
   * Generate email newsletter
   */
  async generateNewsletter() {
    if (!this.enabled) return null;

    const prompt = `
PetCare+ 구독자들을 위한 주간 펫보험 뉴스레터를 작성해주세요.

포함 사항:
1. 이번주 펫보험 관련 뉴스 (3-4개)
2. PetCare+ 플랫폼 팁
3. 사용자 후기/성공 사례
4. 다음주 예정 콘텐츠

JSON 형식:
{
  "subject": "이메일 제목",
  "preview": "미리보기 텍스트",
  "sections": [
    {
      "title": "섹션 제목",
      "content": "내용",
      "icon": "🎯"
    }
  ],
  "cta_button": "클릭 유도 버튼",
  "footer": "푸터 텍스트"
}
    `;

    return await this.callClaudeAPI(prompt, 'newsletter');
  }

  /**
   * Call Claude API for content generation
   */
  async callClaudeAPI(prompt, contentType) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-6',
          max_tokens: 3000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      const generatedContent = JSON.parse(data.content[0].text);
      
      this.generatedContent.push({
        type: contentType,
        content: generatedContent,
        generatedAt: new Date().toISOString(),
        status: 'draft'
      });

      console.log(`✅ ${contentType} generated successfully`);
      return generatedContent;
    } catch (error) {
      console.error(`Failed to generate ${contentType}:`, error);
      return null;
    }
  }

  /**
   * Schedule automatic content generation
   */
  scheduleContentGeneration() {
    if (!this.enabled) return;

    // Daily blog post
    setInterval(() => {
      this.generateBlogPost().then(post => {
        if (post) this.saveToDraft(post, 'blog');
      });
    }, 86400000); // 24 hours

    // Hourly SNS content
    setInterval(() => {
      const platforms = ['instagram', 'twitter', 'facebook'];
      platforms.forEach(platform => {
        this.generateSNSContent(platform).then(content => {
          if (content) this.saveToDraft(content, 'sns');
        });
      });
    }, 3600000); // 1 hour

    console.log('📅 Content generation scheduled');
  }

  /**
   * Save generated content to drafts
   */
  async saveToDraft(content, type) {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          content,
          status: 'draft',
          generatedAt: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        console.log(`📝 ${type} saved to drafts`);
      }
    } catch (error) {
      console.error('Failed to save to drafts:', error);
    }
  }

  /**
   * Get generated content stats
   */
  getStats() {
    return {
      totalGenerated: this.generatedContent.length,
      byType: {
        blog: this.generatedContent.filter(c => c.type === 'blog').length,
        sns: this.generatedContent.filter(c => c.type === 'sns').length,
        newsletter: this.generatedContent.filter(c => c.type === 'newsletter').length
      },
      lastGenerated: this.generatedContent[this.generatedContent.length - 1]?.generatedAt || null
    };
  }
}

const contentGenerator = new ContentGenerator();
export default contentGenerator;
