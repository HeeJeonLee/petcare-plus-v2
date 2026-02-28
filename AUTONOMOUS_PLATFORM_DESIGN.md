# 🤖 PetCare+ 자율진화형 플랫폼 아키텍처 재설계

**작성일**: 2026-02-28
**목표**: Claude Code가 플랫폼 내에서 자율적으로 블로그/SNS를 제어하는 시스템
**우선순위**: 🔴 최우선 (사용자 반복 강조)

---

## 🎯 핵심 개념

### 기존 시스템 (문제점)
```
User → ContentGenerator API → Claude API → 초안 생성 → 관리자 승인 필요 → 배포
                                              (인간 개입 필수)
```

### 새로운 자율진화 시스템 (목표)
```
데이터 수집 (Analytics)
    ↓
AI 에이전트 (Claude Code) - 자율 실행
├─ 블로그 주제 선택 (자동)
├─ 콘텐츠 작성 (자동, Claude API)
├─ SEO 최적화 (자동)
├─ 이미지 프롬프트 생성 (자동)
└─ 발행 (자동)
    ↓
SNS 배포 (자동)
├─ Instagram (해시태그, 이모지 최적화)
├─ Twitter (바이럴 전략)
├─ Facebook (캐주얼 톤)
└─ LinkedIn (전문가 톤)
    ↓
성과 분석 (Analytics)
├─ 조회수, 클릭, 공유
├─ 성과 등급 (S/A/B/C)
└─ 피드백 수집
    ↓
자동 개선 (AI)
├─ 다음 콘텐츠 주제 추천
├─ 문체/톤 조정
└─ SNS 시간 최적화
    ↓
[Loop → 데이터 수집으로 돌아감]

🔑 **인간 역할**: 최종 검수/승인만 (모든 작업 완료 후)
```

---

## 📊 새 시스템 구조 (3계층)

### 계층 1: 데이터 계층
```
Supabase (데이터 저장소)
├─ blog_posts (블로그 포스트)
│  ├─ id, title, slug, content, status
│  ├─ created_at, published_at
│  ├─ views, clicks, shares
│  └─ generation_params (생성 조건 저장)
│
├─ sns_content (SNS 콘텐츠)
│  ├─ id, platform, content, hashtags
│  ├─ status, scheduled_at, published_at
│  ├─ engagement (likes, comments, shares)
│  └─ ai_generated_at (생성 타임스탐프)
│
├─ content_topics (콘텐츠 주제 풀)
│  ├─ topic, category, priority
│  ├─ last_used_date, success_rate
│  └─ ai_recommended (AI 추천 여부)
│
├─ ai_performance_logs (AI 성과 기록)
│  ├─ action_id, action_type (blog/sns)
│  ├─ input_prompt, output_quality
│  ├─ performance_score
│  └─ user_feedback
│
└─ autonomous_workflows (자동 워크플로우)
   ├─ workflow_id, status
   ├─ started_at, completed_at
   └─ results (생성된 콘텐츠 수, 배포 현황)
```

### 계층 2: 오케스트레이션 계층 (Automation Engine)

```
Autonomous Workflow Engine (Node.js + Claude Code)
├─ 스케줄러
│  ├─ 00:00 (자정): 블로그 포스트 자동 생성 시작
│  ├─ 06:00: SNS 콘텐츠 자동 생성 (Instagram)
│  ├─ 12:00: SNS 콘텐츠 자동 생성 (Twitter)
│  ├─ 18:00: SNS 콘텐츠 자동 생성 (Facebook)
│  └─ 23:00: 일일 성과 분석 및 다음날 계획 수립
│
├─ Claude Code Agent (자율 실행)
│  ├─ 주제 선택 에이전트
│  │  ├─ Supabase에서 주제 풀 조회
│  │  ├─ 이전 성과 분석
│  │  └─ 추천 주제 선택 (Claude API)
│  │
│  ├─ 콘텐츠 작성 에이전트
│  │  ├─ 주제 분석
│  │  ├─ 구조 자동 생성
│  │  ├─ 본문 작성 (Claude API)
│  │  ├─ SEO 최적화
│  │  └─ 이미지 프롬프트 생성
│  │
│  ├─ SNS 배포 에이전트
│  │  ├─ 플랫폼별 콘텐츠 변환
│  │  ├─ 해시태그 자동 생성
│  │  ├─ 최적 발행 시간 계산
│  │  └─ 자동 배포
│  │
│  ├─ 성과 분석 에이전트
│  │  ├─ 일일 조회수/클릭 수집
│  │  ├─ 성과 등급 매김 (S/A/B/C)
│  │  ├─ 사용자 피드백 분석
│  │  └─ 개선안 도출
│  │
│  └─ 피드백 루프 에이전트
│     ├─ 이전 성과 조회
│     ├─ 성공 패턴 분석
│     ├─ 다음 주제 추천
│     └─ 콘텐츠 톤/스타일 조정
│
└─ 에러 핸들링 & 재시도
   ├─ API 실패 시 자동 재시도 (지수 백오프)
   ├─ 품질 검사 실패 시 재작성
   └─ 심각한 오류 시 관리자 알림
```

### 계층 3: 사용자 인터페이스 (Admin Dashboard)

```
웹 Dashboard (React 기반)
├─ 📊 실시간 모니터링
│  ├─ 오늘 생성된 콘텐츠 수
│  ├─ SNS 참여도 (실시간 업데이트)
│  ├─ 블로그 방문자 수
│  └─ AI 성과 점수 (자동 계산)
│
├─ 📝 콘텐츠 관리
│  ├─ 생성된 블로그 포스트 목록
│  │  ├─ 상태 (draft/scheduled/published)
│  │  ├─ 성과 메트릭
│  │  ├─ 수정/재생성 버튼
│  │  └─ 일괄 승인/거부
│  │
│  ├─ SNS 콘텐츠 목록
│  │  ├─ 플랫폼별 필터
│  │  ├─ 일정표 (캘린더)
│  │  ├─ 실시간 참여도
│  │  └─ 재생성 옵션
│  │
│  └─ 콘텐츠 주제 풀 관리
│     ├─ 추가/제거/편집
│     ├─ 성공률 표시
│     └─ AI 추천 주제 확인
│
├─ 🤖 AI 에이전트 제어
│  ├─ 에이전트 상태 (실행중/대기중/완료)
│  ├─ 수동 트리거 버튼
│  │  ├─ "지금 블로그 생성"
│  │  ├─ "지금 SNS 생성"
│  │  └─ "성과 분석 실행"
│  ├─ 스케줄 설정
│  │  ├─ 생성 시간 변경
│  │  ├─ 배포 시간 변경
│  │  └─ 쉬는 날 설정
│  └─ 에이전트 로그
│     ├─ 생성된 프롬프트
│     ├─ API 응답
│     ├─ 소요 시간
│     └─ 성공/실패 여부
│
├─ 📈 분석 & 보고서
│  ├─ 일일/주간/월간 성과
│  ├─ 콘텐츠 성능 순위
│  ├─ SNS 채널별 비교
│  ├─ 독자 피드백 분석
│  └─ AI 개선안 제안
│
├─ ⚙️ 설정
│  ├─ AI 모델 설정 (Claude Sonnet vs Opus)
│  ├─ 콘텐츠 스타일 가이드
│  ├─ SEO 키워드 설정
│  ├─ SNS 계정 연동
│  └─ 알림 설정 (이메일, Slack)
│
└─ 📋 승인 워크플로우
   ├─ 대기 중인 콘텐츠 목록
   ├─ 일괄 승인/거부
   ├─ 피드백 추가 (AI 학습용)
   └─ 통계 (승인률, 평균 검토 시간)
```

---

## 🔄 자동 워크플로우 상세

### 워크플로우 1: 일일 블로그 생성 (매 자정)

```
[00:00] 시작
    ↓
[Step 1] 데이터 수집
  - Supabase에서 주제 풀 조회
  - 지난 7일 성과 분석
  - 구글 트렌드 확인
    ↓
[Step 2] 주제 선택 (Claude Code Agent)
  - 프롬프트: "어제 방문자 수가 가장 많았던 주제는...
             지난주 성과 분석 결과...
             현재 관심사는...
             다음 블로그 주제 추천"
  - Claude API 호출 (Opus 모델)
  - 추천 주제 3개 중 최상 선택
    ↓
[Step 3] 콘텐츠 작성 (Claude Code Agent)
  - 프롬프트 엔지니어링
  - 1500-2000자 고품질 글
  - H2/H3 헤더 구조
  - 이모지 삽입
  - CTA (Call To Action) 포함
    ↓
[Step 4] SEO 최적화 (Claude Code Agent)
  - 메타 설명 자동 생성
  - 키워드 밀도 확인
  - URL slug 자동 생성
  - 내부 링크 추천
    ↓
[Step 5] 이미지 프롬프트 생성
  - 콘텐츠 기반 이미지 설명
  - Unsplash/Pexels API 검색 제안
    ↓
[Step 6] 품질 검사 (자동)
  - 글자 수 확인 (1500-2000자)
  - 가독성 점수 (0-100)
  - 품질 점수 (0-100)
  - 기준 미달 시 재작성
    ↓
[Step 7] Supabase 저장
  - status: "draft" (관리자 검수 대기)
  - created_at: 현재 시간
  - generation_params: 선택 주제, 모델, 프롬프트 저장
  - ai_generated_at: 타임스탐프
    ↓
[Step 8] 관리자 알림
  - 이메일: "새 블로그 포스트 완성: [제목]"
  - Dashboard 알림: 최상단 표시
  - 승인 버튼 클릭 시 자동 발행
    ↓
[완료] 로그 기록
```

### 워크플로우 2: SNS 콘텐츠 생성 (매일 3회)

```
[06:00] Instagram 콘텐츠
[12:00] Twitter 콘텐츠
[18:00] Facebook 콘텐츠

각각의 워크플로우:
    ↓
[Step 1] 주제 선택
  - 블로그 포스트 연계 또는 독립 주제
  - 플랫폼별 트렌드 분석
    ↓
[Step 2] 플랫폼별 콘텐츠 생성

  Instagram:
  - 이모지 + 해시태그 (10-15개)
  - 300자 이내
  - 호출 문구 (댓글 유도)

  Twitter:
  - 280자 제한
  - 바이럴 가능성 점수 계산
  - 트렌드 해시태그 포함
  - URL 단축

  Facebook:
  - 친근한 톤 (200-500자)
  - 이야기 형식
  - 사진 설명
  - 좋아요 유도
    ↓
[Step 3] 이미지/영상 프롬프트 생성
  - Canva API 또는 외부 이미지 서비스 연동
  - 자동 배치 레이아웃 제안
    ↓
[Step 4] 최적 발행 시간 계산
  - 플랫폼별 활성화 시간
  - 시간대별 참여도 분석
  - 향후 3시간 내 발행 추천
    ↓
[Step 5] 자동 배포
  - 플랫폼 API 연동 (Meta Business Suite 등)
  - 예약 발행 또는 즉시 발행
  - 타임존 자동 조정
    ↓
[Step 6] 성과 추적
  - published_at 기록
  - 2시간 후부터 실시간 모니터링
  - 참여도 수집 (2시간, 6시간, 24시간)
```

### 워크플로우 3: 성과 분석 및 피드백 루프 (매일 23:00)

```
[23:00] 시작
    ↓
[Step 1] 일일 성과 데이터 수집
  - 블로그: 방문자, 조회 시간, 스크롤 깊이, 클릭 위치
  - SNS: 좋아요, 댓글, 공유, 클릭 (각 플랫폼)
  - 이메일: 오픈율, 클릭율
    ↓
[Step 2] 성과 점수 계산 (0-100)

  블로그:
  - 방문자 × 10 (목표 100명 기준)
  - 평균 체류 시간 × 5 (목표 2분 기준)
  - 클릭 수 × 20 (목표 5클릭 기준)
  → 가중 평균

  SNS:
  - 참여율 (좋아요+댓글+공유) / 팔로워 × 100
  - 클릭 수 / 노출수 × 100
  → 평균
    ↓
[Step 3] 성과 등급 매김 (A/B/C/D)
  - S: 90점 이상 (매우 우수)
  - A: 70-89점 (우수)
  - B: 50-69점 (보통)
  - C: 30-49점 (미흡)
  - D: 30점 미만 (재작업 필요)
    ↓
[Step 4] AI 피드백 분석 (Claude Code Agent)
  - 프롬프트:
    "오늘 생성한 블로그 [제목]의 성과:
     - 방문자 수: [수치]
     - 평균 체류 시간: [시간]
     - 클릭 수: [수치]
     - SNS 공유: [수치]

     해당 글의 주제, 제목, 구조, 톤을 분석하여
     다음에 더 높은 성과를 얻을 수 있는 개선안을 제시"

  - Claude API 호출 (Sonnet 모델 - 빠름)
  - 분석 결과 저장
    ↓
[Step 5] 다음날 주제 추천 (Claude Code Agent)
  - 프롬프트:
    "지난 7일 성과 분석:
     - 최고 성과: [주제] (95점)
     - 최저 성과: [주제] (35점)
     - 평균: 65점

     내일의 블로그 주제를 3개 추천하되,
     1순위는 최고 성과 주제와 유사한 주제
     2순위는 현재 트렌드 주제
     3순위는 미흡한 주제 개선 버전"

  - Supabase의 content_topics 테이블 업데이트
    ↓
[Step 6] 콘텐츠 톤/스타일 조정
  - S등급 글의 특징 분석
  - 문체, 길이, 구조, 이모지 사용법 추출
  - 다음 프롬프트에 반영할 "스타일 가이드" 생성
    ↓
[Step 7] SNS 시간 최적화
  - 각 플랫폼별 최고 성과 시간대 분석
  - 팔로워 수 증가 추세 분석
  - 내일의 SNS 발행 시간 자동 조정
    ↓
[Step 8] 주간/월간 리포트 생성
  - 매주 월요일 주간 리포트
  - 매월 1일 월간 리포트
  - AI 생성 리포트 (Markdown)
  - 관리자 이메일 발송
    ↓
[완료] 로그 기록
    ↓
[00:00] 다시 블로그 생성으로 돌아감
```

---

## 💾 저장소 구조 (Supabase)

### blog_posts 테이블

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  summary TEXT (100자),

  -- 생성 정보
  ai_generated_at TIMESTAMP,
  generation_model TEXT ('sonnet' | 'opus'),
  generation_prompt TEXT (원본 프롬프트),

  -- 상태
  status TEXT ('draft' | 'scheduled' | 'published' | 'archived'),
  created_at TIMESTAMP,
  published_at TIMESTAMP,

  -- 성과
  views INTEGER DEFAULT 0,
  avg_read_time FLOAT,
  bounce_rate FLOAT,
  click_count INTEGER DEFAULT 0,
  engagement_score FLOAT (0-100),

  -- SEO
  meta_description TEXT,
  keywords TEXT[],

  -- 관리
  last_updated TIMESTAMP,
  updated_by TEXT,
  admin_notes TEXT
);
```

### sns_content 테이블

```sql
CREATE TABLE sns_content (
  id UUID PRIMARY KEY,
  platform TEXT ('instagram' | 'twitter' | 'facebook' | 'linkedin'),
  content TEXT NOT NULL,
  hashtags TEXT[],

  -- 생성 정보
  ai_generated_at TIMESTAMP,
  generation_prompt TEXT,

  -- 상태
  status TEXT ('draft' | 'scheduled' | 'published'),
  scheduled_at TIMESTAMP,
  published_at TIMESTAMP,

  -- 성과
  impressions INTEGER DEFAULT 0,
  engagement_count INTEGER DEFAULT 0,
  engagement_rate FLOAT (0-100),
  clicks INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,

  -- 관리
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### ai_performance_logs 테이블

```sql
CREATE TABLE ai_performance_logs (
  id UUID PRIMARY KEY,
  action_id UUID (blog_post_id 또는 sns_content_id),
  action_type TEXT ('blog' | 'sns'),

  -- 입력
  input_prompt TEXT (실제 사용된 프롬프트),
  tokens_used INTEGER,

  -- 출력
  output_quality_score FLOAT (0-100),
  generation_time_ms INTEGER,

  -- 성과
  performance_score FLOAT (0-100),
  user_feedback TEXT (관리자 피드백),

  -- 추적
  created_at TIMESTAMP,
  final_performance_score FLOAT (24시간 후 최종 점수)
);
```

---

## 🔐 보안 고려사항

1. **API 키 관리**
   - Claude API 키: .env.local (git 무시)
   - SNS 연동 토큰: Supabase Vault 또는 Vercel Secrets

2. **인증 및 권한**
   - 대시보드: 관리자만 접근
   - 콘텐츠 승인: 특정 역할만 가능
   - 에이전트 수동 제어: 관리자 확인 후 실행

3. **감사 추적**
   - 모든 변경사항 로그 기록
   - AI가 생성한 콘텐츠 오리지널 프롬프트 저장
   - 관리자의 승인/거부 이력

---

## 🚀 구현 로드맵

### Week 1: 데이터 계층 구축
- [ ] Supabase 테이블 설계 및 생성
- [ ] 권한 설정 (RLS)
- [ ] 백업 전략 수립

### Week 2: 오케스트레이션 엔진 구축
- [ ] Node.js 스케줄러 구현
- [ ] Claude Code Agent 기본 구조
- [ ] 에러 핸들링 및 재시도 로직

### Week 3: 각 에이전트 구현
- [ ] 주제 선택 에이전트
- [ ] 콘텐츠 작성 에이전트
- [ ] SNS 배포 에이전트
- [ ] 성과 분석 에이전트

### Week 4: Admin Dashboard 개발
- [ ] React 컴포넌트 구현
- [ ] 실시간 업데이트 (WebSocket)
- [ ] 데이터 시각화 (Chart.js)

### Week 5: 통합 테스트 및 배포
- [ ] E2E 테스트
- [ ] 성능 최적화
- [ ] Vercel 배포

---

## 📌 모든 변경사항 저장

이 문서는 CLAUDE.md와 함께 유지되며:
- 새로운 요구사항 발생 시 즉시 업데이트
- 구현 진행 상황 추적
- 완료된 항목 체크 표시
- 버전 관리 (git)

---

**상태**: 🔴 설계 완료, 구현 준비 중
**다음 단계**: Supabase 테이블 설계 시작
