# PetCare+ 프로젝트 컨텍스트

## 프로젝트 개요

**이름:** PetCare+ (petcareplus.kr)  
**목적:** 펫보험 비교 플랫폼 + AI 상담 + 자율 진화형 시스템  
**저장소:** petcare-plus-v2  
**소유자:** 이희전 (25년 경력 보험 컨설턴트, 미래에셋금융서비스)  
**사업자:** 수인AI브릿지 (119-13-49535)  
**연락처:** hejunl@hanmail.net, 010-5650-0670  
**상담사 코드:** 251220019

---

## 기술 스택

### Frontend
- React + Vite
- TailwindCSS
- PWA (설치 가능)

### Backend & Services
- Vercel (호스팅 + 서버리스)
- Supabase (데이터베이스)
  - 프로젝트: consultant-landing
  - DB 비밀번호: PetCare2026!
- Resend (이메일 발송)
- Google Maps API (동물병원 검색)
- Anthropic Claude API (AI 챗봇)

### 배포
- 메인: petcareplus.kr
- 랜딩페이지: insurance-consultant-landing.vercel.app

---

## 환경 변수

### petcare-plus-v2 (메인 사이트)
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSy... (Google Cloud Console)
VITE_SUPABASE_ANON_KEY=sb_publishable_... (Supabase anon key)
RESEND_API_KEY=re_... (Resend.com)
```

### insurance-consultant-landing (랜딩페이지)
```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
RESEND_API_KEY=re_...
VITE_CONSULTANT_CODE=251220019
VITE_CONSULTANT_NAME=이희전
VITE_CONSULTANT_EMAIL=hejunl@hanmail.net
```

---

## 프로젝트 구조

```
petcare-plus-v2/
├── src/
│   ├── App.jsx                    # 메인 앱 (보험금 청구 프로세스 포함)
│   ├── components/
│   │   ├── Hero.jsx               # 히어로 섹션
│   │   ├── InsuranceComparison.jsx # 8개사 보험 비교표
│   │   ├── ChatBot.jsx            # AI 상담 챗봇
│   │   ├── HospitalFinder.jsx     # 동물병원 검색 (현재 오류)
│   │   ├── ClaimProcess.jsx       # 보험금 청구 프로세스 (2026-02-20 추가)
│   │   ├── Contact.jsx            # 상담 신청 폼
│   │   └── Footer.jsx
│   └── main.jsx
├── api/
│   └── send-email.js              # Vercel 서버리스 이메일 발송
└── public/
```

---

## 보험사 정보 (8개사)

1. **메리츠화재** (펫퍼민트)
   - 점유율 1위, 제휴병원 2,000개, 자동 청구
   - 보장률 90%, 가입 만 10세까지
   - 추천: 소형견(슬개골), 청구 편의성 중시

2. **삼성화재** (위풍댕댕/애니펫)
   - 다견 10% 할인, 치과 특화
   - 보장률 80%, 가입 만 10세까지
   - 추천: 다견 가정, 치과 질환

3. **현대해상** (굿앤굿우리펫)
   - 가성비 우수, 100% 보장
   - 가입 만 10세까지
   - 추천: 대형견, 예산 중시

4. **KB손해보험** (금쪽같은펫)
   - MRI/CT 최고 한도, 고액 치료 대비
   - 보장률 90%, 가입 만 10세까지
   - 추천: 대형견, 노령견, 검사비 중시

5. **DB손해보험** (프로미라이프펫블리/아이러브펫)
   - 슬개골 특화, 12세까지 가입 가능
   - 보장률 90%
   - 추천: 소형견, 슬개골 문제

6. **한화손해보험** (댕댕이)
   - 실속형, 핵심 보장
   - 추천: 예산 제한

7. **NH농협손해보험** (지킴이펫)
   - 배상책임 특화, 장례비용
   - 추천: 배상책임 중시

8. **롯데/하나손해보험**
   - 기본 보장, 낮은 인지도
   - 추천: 제한적

### 견종별 추천
- 소형견 (말티즈, 포메라니안, 치와와): DB, 메리츠 (슬개골, 치과)
- 대형견 (리트리버): KB, 현대 (MRI/CT, 고관절)
- 다견 가정: 삼성 (10% 할인)

---

## 현재 상태 (2026-02-28)

### ✅ 완료된 작업

#### 2026-02-20 메인 사이트 수정
1. App.jsx 교체 (ClaimProcess 컴포넌트 추가)
2. HospitalFinder.jsx 교체 (무한 로딩 수정 시도)
3. ClaimProcess.jsx 신규 추가 (보험금 청구 프로세스 안내)
4. api/send-email.js 추가 (Resend API 연동)
5. 환경변수 3개 추가 및 배포 성공

#### 2026-02-20 랜딩페이지 수정
1. ChatBot.jsx 교체 (8개사 데이터 포함, 독립 컴포넌트)
2. api/send-email.js 추가
3. 환경변수 7개 확인
4. 배포 성공

#### 이전 작업
- PetCare+ v2.0 완전판 배포 (2026-02-16)
- 사업계획서 PPT 14슬라이드 완성 (2026-02-18)
- Google Analytics 연동
- PWA 설치 기능

---

### ❌ 미완료 (긴급 수정 필요)

#### 1. 동물병원 검색 오류 🔴
**증상:**
- "⚠️ 지도 서비스 로딩 중입니다" 에러
- 검색 작동 안 함

**시도한 해결책:**
- Google Maps API 키 "키 제한 없음"으로 변경 ✅
- 새 API 키 생성 및 환경변수 업데이트 ✅
- Vercel Redeploy 실행 ✅
- 여전히 작동 안 함 ❌

**추정 원인:**
- Google Maps 스크립트 로딩 타이밍 문제
- HospitalFinder.jsx의 로직 오류
- API 키 활성화 대기 시간 필요

**파일:** `src/components/HospitalFinder.jsx`

#### 2. 랜딩페이지 상담 신청 폼 데이터 공란 🔴
**증상:**
- 이메일은 수신됨 (hejunl@hanmail.net)
- 모든 데이터 필드가 비어있음 (-, "내용 없음")

**원인:**
- Contact.jsx에서 폼 데이터가 API로 전달 안 됨
- 또는 api/send-email.js에서 데이터 파싱 실패

**파일:** `src/components/Contact.jsx`, `api/send-email.js`

---

### 🔄 계획된 작업: 자율 진화형 시스템

#### Phase 1: 데이터 수집 시스템
**Supabase 테이블 확장:**
```sql
-- 사용자 행동 추적
CREATE TABLE user_behaviors (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  event_type TEXT,
  event_data JSONB,
  page_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 챗봇 대화 로그
CREATE TABLE chatbot_conversations (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  user_message TEXT,
  ai_response TEXT,
  helpful BOOLEAN,
  topic_tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 보험 추천 로그
CREATE TABLE insurance_recommendations (
  id SERIAL PRIMARY KEY,
  session_id TEXT,
  pet_type TEXT,
  pet_age INTEGER,
  recommended_companies TEXT[],
  user_selected TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 자동 학습 인사이트
CREATE TABLE auto_insights (
  id SERIAL PRIMARY KEY,
  insight_type TEXT,
  insight_data JSONB,
  confidence_score FLOAT,
  applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**프론트엔드 추적:**
- `utils/analytics.js` 생성
- 클릭, 스크롤, 폼 제출 자동 추적
- Supabase에 실시간 저장

#### Phase 2: AI 자동 분석
- Vercel Cron Job (일일 1회)
- Claude API로 데이터 분석
- 인사이트 자동 생성 및 저장

#### Phase 3: 자동 적용
- 챗봇 지식베이스 동적 업데이트
- FAQ 자동 생성
- 추천 알고리즘 자동 조정

#### Phase 4: A/B 테스트
- 자동 실험 시스템
- 통계적 유의성 검증
- 승자 자동 선정 및 적용

**예상 비용:** ~$50/월 (Vercel Pro + Claude API)

---

## 중요 교훈

### GitHub 파일 업로드
```
❌ "Upload files" 사용 시:
   → .txt 확장자 자동 추가됨
   → 예: HospitalFinder.jsx → HospitalFinder.jsx.txt
   → 빌드 실패!

✅ "Create new file" 사용:
   → 파일명 정확히 제어 가능
   → 슬래시(/)로 폴더 자동 생성
   → 예: src/components/ChatBot.jsx
```

### Vercel 배포
```
파일 하나씩 업로드 시:
→ 각 커밋마다 자동 배포 시작
→ 다른 파일 없으면 빌드 실패
→ 계속 에러 발생

해결:
→ 모든 파일 커밋 완료 후 Redeploy
→ 또는 자동 배포 일시 중지
```

### 환경변수
```
추가/수정 후:
→ 반드시 Redeploy 필요
→ 새 배포에서만 반영됨
```

---

## 작업 규칙

### 코드 스타일
- React 함수형 컴포넌트
- Tailwind CSS 사용
- 한글 주석 (중요한 로직에만)
- export default 사용

### 파일 생성/수정
1. 항상 "Create new file" 사용 (GitHub)
2. 파일명 대소문자 정확히
3. 확장자 확인 (.jsx, .js, .md)
4. 커밋 메시지 명확히

### 배포 프로세스
1. 모든 파일 GitHub 업로드 완료
2. Vercel Deployments 확인
3. Ready 상태 확인
4. 기능 테스트
5. 문제 발생 시 즉시 수정

### 테스트 체크리스트
```
petcareplus.kr:
□ 페이지 로딩
□ AI 챗봇 작동
□ 보험 비교표 표시
□ 동물병원 검색 (현재 오류)
□ 보험금 청구 프로세스 표시
□ 상담 신청 폼
□ 이메일 수신

insurance-consultant-landing:
□ 페이지 로딩
□ AI 챗봇 작동
□ 상담 신청 폼 (현재 데이터 공란 오류)
□ 이메일 수신
```

---

## 다음 작업 우선순위

### 1순위: 긴급 버그 수정 (1-2시간)
1. 동물병원 검색 오류 수정
   - HospitalFinder.jsx 디버깅
   - Google Maps API 로딩 확인
   - Console 로그 분석

2. 랜딩페이지 폼 데이터 공란 수정
   - Contact.jsx 폼 데이터 전달 확인
   - api/send-email.js 데이터 파싱 확인
   - Supabase 연동 테스트

### 2순위: 자율 진화형 시스템 Phase 1 (2-3시간)
1. Supabase 테이블 생성
2. utils/analytics.js 생성
3. 프론트엔드 추적 코드 삽입
4. api/track.js 엔드포인트 생성

### 3순위: 자율 진화형 시스템 Phase 2-4 (추후)
1. Vercel Cron Job 설정
2. Claude API 분석 로직
3. 자동 적용 시스템
4. A/B 테스트 시스템

---

## 자주 사용하는 명령어

### Git
```bash
git add .
git commit -m "메시지"
git push origin main
```

### Vercel CLI
```bash
vercel deploy
vercel env add VARIABLE_NAME
vercel env ls
```

### 개발
```bash
npm install
npm run dev
npm run build
```

---

## 연락처 & 링크

- **이메일:** hejunl@hanmail.net
- **전화:** 010-5650-0670
- **메인 사이트:** https://petcareplus.kr
- **랜딩페이지:** https://insurance-consultant-landing.vercel.app
- **GitHub:** petcare-plus-v2 저장소
- **Vercel:** petcare-plus-v2, insurance-consultant-landing
- **Supabase:** consultant-landing 프로젝트

---

## 메모

- 사용자는 매우 바쁘고 예산이 제한적임
- 완전 자동화, 비대면, 자율 진화형 플랫폼을 원함
- 수동 작업 최소화 필요
- 실수 없이 정확한 작업 필수
- 복사/붙여넣기도 부담스러워함
- Claude Code와 Claude.ai 기억 공유 필요

---

**마지막 업데이트:** 2026-02-28  
**작성자:** Claude (Claude.ai)  
**목적:** Claude Code와 기억 공유, 작업 연속성 확보
