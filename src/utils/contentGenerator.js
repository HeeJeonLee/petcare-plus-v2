/**
 * PetCare+ Autonomous Content Generator
 * 자율진화형 블로그 + SNS + 뉴스레터 자동 생성
 * Claude AI 기반 고급 콘텐츠 마케팅 시스템
 */

class ContentGenerator {
  constructor() {
    this.enabled = import.meta.env.VITE_CONTENT_GENERATION_ENABLED === 'true';
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    this.blogFrequency = import.meta.env.VITE_BLOG_POST_FREQUENCY || 'daily';
    this.snsFrequency = import.meta.env.VITE_SNS_POST_FREQUENCY || 'hourly';
    this.language = 'ko';
    this.generatedContent = [];
    this.autoPublishEnabled = import.meta.env.VITE_AUTO_PUBLISH_ENABLED === 'true';

    console.log('🤖 PetCare+ 자율진화형 콘텐츠 생성기 초기화 완료');
    console.log(`   활성화: ${this.enabled ? '✅' : '❌'}`);
    console.log(`   자동 발행: ${this.autoPublishEnabled ? '✅' : '❌'}`);
  }

  /**
   * 고품질 블로그 포스트 생성
   */
  async generateBlogPost(topic = null) {
    if (!this.enabled || !this.apiKey) {
      console.warn('⚠️ 콘텐츠 생성이 비활성화되어 있습니다');
      return null;
    }

    // 20개의 다양한 주제
    const topics = [
      "펫보험 가입 시 꼭 확인해야 할 5가지",
      "반려견 슬개골 탈구, 이렇게 준비하세요",
      "2026년 펫보험 트렌드 분석 리포트",
      "응급 상황 대비, 펫보험이 꼭 필요한 이유",
      "견종별 발병 확률 높은 질환과 보험 대책",
      "펫보험 갱신 전 반드시 체크해야 할 사항",
      "반려견 고관절 이형성증, 보험으로 대비하기",
      "귀여운 반려견도 치과 치료가 필요합니다",
      "펫보험 비교할 때 절대 놓쳐서는 안 될 항목",
      "나이별 반려동물 건강관리와 최적 보험 선택",
      "펫보험 청구 거절, 이렇게 대처하세요",
      "반려견 예방접종, 펫보험으로 보장받을 수 있나요?",
      "소형견 vs 대형견, 보험료 차이는 얼마?",
      "고양이만 가능한 펫보험 특약 Best 3",
      "펫보험과 함께하는 행복한 반려동물 생활",
      "보험으로 준비하는 반려동물 노후 대책",
      "펫보험 가입 후 병원비 청구 절차 완전 정복",
      "8개 보험사 비교분석: 당신의 반려견은?",
      "펫보험 없이 했다면? 실제 사례로 배우기",
      "2026년 반려동물 의료비 인상에 대비하기"
    ];

    const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];

    const systemPrompt = `당신은 펫보험 분야의 최고 수준 블로거입니다.
25년 경력의 펫보험 전문가로서 정확하고 실용적인 정보를 제공합니다.
다음 블로그 글 작성 시 이 기준을 반드시 따르세요:
1. 제목은 클릭 유도성 높음 (숫자, 질문형 활용)
2. 서론은 감정적으로 접근 (공감 유도)
3. 본문은 실용적 조언 중심
4. 수치와 구체적 사례 포함
5. PetCare+ 자연스럽게 언급
6. 마지막에 강력한 CTA
7. 이모지로 시각적 강조
8. SEO 최적화 키워드 포함`;

    const userPrompt = `이 주제로 최고 품질의 블로그 글을 작성해주세요:

제목: ${selectedTopic}

요구사항:
- 1800~2200자의 상세하고 실용적인 글
- 반려견 주인의 실제 고민 해결에 초점
- PetCare+ 플랫폼을 자연스럽게 소개 (강요 금지!)
- 이모지 적절히 사용 (과하지 않게)
- 소제목과 리스트로 구조화
- 마지막에 강력한 클릭 유도 문구

JSON 형식으로 응답 (한국어):
{
  "title": "블로그 제목",
  "slug": "url-slug-format",
  "content": "완전한 본문 내용 (마크다운 형식 가능)",
  "summary": "100자 이내 요약",
  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "category": "펫보험|건강|법규|팁|사례 중 하나",
  "thumbnail_prompt": "썸네일 이미지 생성 프롬프트 (영문)",
  "seo_meta": "검색엔진용 메타 설명",
  "reading_time": "예상 읽기 시간 (분)",
  "cta_text": "강력한 클릭 유도 문구",
  "estimated_views": "예상 조회수 (수치)",
  "hashtags": ["#태그1", "#태그2"]
}`;

    try {
      console.log(`📝 블로그 생성 시작: "${selectedTopic}"`);
      const content = await this.callClaudeAPI(systemPrompt, userPrompt, 'blog_post');

      if (content) {
        console.log(`✅ 블로그 생성 완료: ${content.title}`);
        if (this.autoPublishEnabled) {
          await this.publishContent(content, 'blog');
        }
      }
      return content;
    } catch (error) {
      console.error(`❌ 블로그 생성 실패: ${error.message}`);
      return null;
    }
  }

  /**
   * SNS 콘텐츠 고도화 생성 (Instagram, Twitter, Facebook)
   */
  async generateSNSContent(platform = 'instagram') {
    if (!this.enabled || !this.apiKey) return null;

    const platformConfigs = {
      instagram: {
        name: 'Instagram',
        charLimit: 2200,
        hashtags: 15,
        format: '시각적, 감정 중심, 해시태그 풍부',
        tone: '친근하고 트렌디한'
      },
      twitter: {
        name: 'Twitter/X',
        charLimit: 280,
        hashtags: 2,
        format: '간결하고 임팩트 있는',
        tone: '빠르고 정보 중심'
      },
      facebook: {
        name: 'Facebook',
        charLimit: 500,
        hashtags: 3,
        format: '따뜻하고 커뮤니티 중심',
        tone: '캐주얼하고 친근한'
      },
      tiktok: {
        name: 'TikTok',
        charLimit: 150,
        hashtags: 5,
        format: '트렌디하고 재미있는',
        tone: '유머있고 신선한'
      }
    };

    const config = platformConfigs[platform] || platformConfigs.instagram;

    const snsTopics = [
      "펫보험 가입하면 평생 혜택이?",
      "반려견 건강검진, 보험으로 100% 커버!",
      "슬개골 질환, 조기 가입이 답입니다",
      "응급 수술, 보험 없으면 몇 백만원?",
      "펫보험 비교, 가장 쉬운 방법은?",
      "우리 아이 생명을 위한 투자",
      "펫보험 가입자들의 실제 후기",
      "반려견 나이별 필수 관리법",
      "동물병원 비용, 이제는 걱정 NO!",
      "펫보험 5분만에 가입하는 법"
    ];

    const topic = snsTopics[Math.floor(Math.random() * snsTopics.length)];

    const systemPrompt = `당신은 ${config.name} 마케팅 전문가입니다.
${config.tone} 톤으로 높은 엔게이지먼트를 유도하는 콘텐츠를 만듭니다.
플랫폼 특성에 맞는 최고 수준의 마케팅 콘텐츠를 작성하세요.`;

    const userPrompt = `${config.name} 플랫폼용 펫보험 마케팅 콘텐츠를 작성하세요:

주제: ${topic}
플랫폼: ${config.name}
제한: ${config.charLimit}자 이내
톤: ${config.tone}
포맷: ${config.format}
해시태그: ${config.hashtags}개

요구사항:
- 높은 엔게이지먼트 유도
- 클릭/공유 유도 강력
- 플랫폼 특성 완벽 반영
- 이모지 전략적 사용
- 강력한 CTA

JSON 형식 (한국어):
{
  "platform": "${platform}",
  "content": "게시물 텍스트 (${config.charLimit}자 이내)",
  "hashtags": ["#태그1", "#태그2"],
  "emoji": "🐾",
  "engagement_prediction": "예상 엔게이지먼트 (높음/중간/보통)",
  "best_posting_time": "최적 발행 시간 (HH:mm, 서울 기준)",
  "cta": "클릭 유도 문구",
  "image_prompt": "이미지 생성 프롬프트 (영문)",
  "estimated_reach": "예상 도달 범위",
  "vibe": "이 게시물의 느낌"
}`;

    try {
      console.log(`📱 ${config.name} 콘텐츠 생성 중...`);
      const content = await this.callClaudeAPI(systemPrompt, userPrompt, 'sns_post');

      if (content && this.autoPublishEnabled) {
        await this.publishContent(content, 'sns', platform);
      }
      return content;
    } catch (error) {
      console.error(`❌ SNS 콘텐츠 생성 실패 (${platform}): ${error.message}`);
      return null;
    }
  }

  /**
   * 고급 뉴스레터 생성
   */
  async generateNewsletter() {
    if (!this.enabled || !this.apiKey) return null;

    const systemPrompt = `당신은 펫보험 분야의 뉴스레터 에디터입니다.
구독자들이 정말 원하는 유용한 정보를 제공하는 것을 목표로 합니다.`;

    const userPrompt = `PetCare+ 주간 뉴스레터를 작성하세요:

포함 사항:
1. 이번주 펫보험/반려동물 건강 뉴스 (3-4개, 구체적)
2. PetCare+ 플랫폼 사용 팁
3. 사용자 성공 사례 (감정적 스토리)
4. 다음주 예정 콘텐츠
5. 강력한 CTA

요구사항:
- 따뜻하고 전문적인 톤
- 가독성 높음 (섹션별 명확한 구분)
- 실용적 정보 중심
- 이모지로 시각적 강조

JSON 형식:
{
  "subject": "주제명",
  "preview": "미리보기 텍스트 (50자 이내)",
  "sections": [
    {
      "title": "섹션 제목",
      "content": "본문",
      "icon": "🎯",
      "cta_link": "링크 (옵션)"
    }
  ],
  "featured_story": {
    "title": "주요 기사",
    "content": "상세 내용",
    "source": "출처"
  },
  "user_success_story": {
    "name": "사용자명",
    "story": "성공 사례",
    "quote": "추천글귀"
  },
  "cta_button": "클릭 유도 버튼 텍스트",
  "next_week_preview": "다음주 예정",
  "footer": "푸터 (회사 정보)",
  "estimated_open_rate": "예상 오픈율"
}`;

    try {
      console.log('📧 뉴스레터 생성 중...');
      const content = await this.callClaudeAPI(systemPrompt, userPrompt, 'newsletter');

      if (content && this.autoPublishEnabled) {
        await this.publishContent(content, 'newsletter');
      }
      return content;
    } catch (error) {
      console.error(`❌ 뉴스레터 생성 실패: ${error.message}`);
      return null;
    }
  }

  /**
   * Claude API 호출 (고급 버전)
   */
  async callClaudeAPI(systemPrompt, userPrompt, contentType) {
    if (!this.apiKey) {
      throw new Error('VITE_ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다');
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-6',
          max_tokens: 4000,
          temperature: 0.8,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      const generatedContent = JSON.parse(data.content[0].text);

      this.generatedContent.push({
        id: Date.now(),
        type: contentType,
        content: generatedContent,
        generatedAt: new Date().toISOString(),
        status: 'draft',
        published: false
      });

      return generatedContent;
    } catch (error) {
      console.error(`API 호출 실패: ${error.message}`);
      throw error;
    }
  }

  /**
   * 자동 발행 (선택사항)
   */
  async publishContent(content, type, platform = null) {
    try {
      const payload = {
        type,
        platform,
        content,
        status: 'published',
        publishedAt: new Date().toISOString()
      };

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log(`✅ ${type} 자동 발행 완료`);

        // 발행 상태 업데이트
        const lastContent = this.generatedContent[this.generatedContent.length - 1];
        if (lastContent) lastContent.published = true;
      }
    } catch (error) {
      console.warn(`⚠️ 자동 발행 실패: ${error.message}`);
    }
  }

  /**
   * 자동 스케줄 시작
   */
  scheduleContentGeneration() {
    if (!this.enabled) {
      console.warn('⚠️ 콘텐츠 생성이 비활성화되어 있습니다');
      console.log('활성화하려면: VITE_CONTENT_GENERATION_ENABLED=true 설정');
      return;
    }

    console.log('📅 자율진화형 콘텐츠 생성 스케줄 시작');

    // 일일 블로그 (자정)
    this.scheduleDailyBlog();

    // 시간별 SNS (4시간마다, 전 플랫폼)
    this.scheduleHourlySNS();

    // 주간 뉴스레터 (매주 월요일 8시)
    this.scheduleWeeklyNewsletter();

    console.log('✅ 모든 스케줄 설정 완료');
  }

  scheduleDailyBlog() {
    // 매일 자정에 실행
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const delay = tomorrow - now;

    setTimeout(() => {
      this.generateBlogPost();
      setInterval(() => this.generateBlogPost(), 86400000);
    }, delay);

    console.log('📝 일일 블로그 스케줄 설정 완료');
  }

  scheduleHourlySNS() {
    const platforms = ['instagram', 'twitter', 'facebook', 'tiktok'];

    // 첫 실행
    platforms.forEach(platform => {
      this.generateSNSContent(platform);
    });

    // 4시간마다 반복
    setInterval(() => {
      platforms.forEach(platform => {
        this.generateSNSContent(platform);
      });
    }, 4 * 60 * 60 * 1000);

    console.log('📱 SNS 콘텐츠 스케줄 설정 (4시간마다)');
  }

  scheduleWeeklyNewsletter() {
    // 매주 월요일 8시
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(nextMonday.getDate() + (1 + 7 - nextMonday.getDay()) % 7);
    nextMonday.setHours(8, 0, 0, 0);

    const delay = nextMonday - now;

    setTimeout(() => {
      this.generateNewsletter();
      setInterval(() => this.generateNewsletter(), 7 * 24 * 60 * 60 * 1000);
    }, delay);

    console.log('📧 주간 뉴스레터 스케줄 설정 (매주 월요일 8시)');
  }

  /**
   * 통계 조회
   */
  getStats() {
    const blogCount = this.generatedContent.filter(c => c.type === 'blog').length;
    const snsCount = this.generatedContent.filter(c => c.type === 'sns_post').length;
    const newsletterCount = this.generatedContent.filter(c => c.type === 'newsletter').length;
    const publishedCount = this.generatedContent.filter(c => c.published).length;

    return {
      enabled: this.enabled,
      autoPublishEnabled: this.autoPublishEnabled,
      totalGenerated: this.generatedContent.length,
      published: publishedCount,
      byType: { blog: blogCount, sns: snsCount, newsletter: newsletterCount },
      drafts: this.generatedContent.filter(c => c.status === 'draft').length,
      lastGenerated: this.generatedContent[this.generatedContent.length - 1]?.generatedAt || null,
      estimatedReach: blogCount * 500 + snsCount * 100 + newsletterCount * 200
    };
  }
}

const contentGenerator = new ContentGenerator();
export default contentGenerator;
