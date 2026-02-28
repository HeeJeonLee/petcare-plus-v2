# 🐾 PetCare+ Claude Code 프로젝트 지침서

**프로젝트명**: PetCare+ (펫보험 AI 비교 플랫폼)
**저장소**: https://github.com/HeeJeonLee/petcare-plus-v2
**주요 담당자**: 이희천 (사업자/보험컨설턴트)
**마지막 업데이트**: 2026-02-28 (최신: API 키 설정 + 사업자 정보 업데이트)

---

## 🎯 프로젝트 개요

### 비전
대한민국 최고의 AI 기반 펫보험 비교 플랫폼으로, Claude AI를 활용한 24시간 무료 상담과 8개 보험사 실시간 비교 서비스 제공

### 핵심 기능
1. ✅ AI 맞춤형 펫보험 추천 (Claude API)
2. ✅ 8개 보험사 상세 비교표
3. ✅ AI 챗봇 상담 (24시간)
4. ✅ 주변 동물병원 검색 (Google Maps)
5. ✅ 보험금 청구 프로세스 가이드
6. ⚠️ 상담 신청 이메일 발송 (미완성 - 아래 참고)

---

## 🔴 **현재 상태: 6가지 긴급 이슈**

### 1️⃣ **이메일 발송 미작동** ⚠️ 최우선
- **증상**: 상담 신청 폼 제출 후 이메일이 고객에게 전달되지 않음
- **원인**: RESEND_API_KEY 환경변수 미설정
- **해결책**:
  ```bash
  # 1. https://resend.com에서 무료 API 키 발급
  # 2. .env.local에 설정:
  RESEND_API_KEY=re_xxxxxxxxxxxxxx
  PETCARE_ADMIN_EMAIL=your_email@gmail.com

  # 3. 로컬 테스트:
  npm run api-server    # 터미널 1
  npm run dev           # 터미널 2

  # 4. 폼 제출 후 이메일 수신 확인
  ```

### 2️⃣ **Google Maps 검색 미작동** ⚠️ 긴급
- **증상**: "주변 동물병원 찾기" 클릭 시 지도가 로드되지 않음
- **원인**:
  - index.html 라인 35에 하드코딩된 Google Maps API 키 노출 (보안 위험!)
  - VITE_GOOGLE_MAPS_API_KEY 환경변수 미설정
- **해결책**:
  ```bash
  # 1. index.html 라인 35 Google Maps API 키 제거 필수!
  # 2. Google Cloud Console에서 새 API 키 발급
  # 3. .env.local에 설정:
  VITE_GOOGLE_MAPS_API_KEY=AIzaSy...

  # 4. 로컬 테스트 후 확인
  ```

### 3️⃣ **UI/UX 불일치**
- **증상**: 무료상담 3개 버튼 중 일부가 세로, 일부가 가로로 표시됨
- **원인**: 스타일 불일치
- **파일**: src/App.jsx 라인 179-200
- **수정**: 모든 버튼에 동일 스타일 적용

### 4️⃣ **신규 사업자 정보 반영 완료** ✅
- **변경 완료**: 2026.02.27 최신 사업자 정보 적용
- **사업자정보**:
  - 상호: 수인AI브릿지
  - 사업자등록번호: 151-09-03201
  - 개업일: 2026년 02월 25일
  - 주소: 경기도 수원시 영통구 동탄원천로1109번길 37, 103층 502호
  - 대표자: 이희천
- **수정 완료 파일**:
  - ✅ .env.local (비즈니스 정보)
  - [ ] src/App.jsx (footer 업데이트)
  - [ ] api-server.js (이메일 footer 업데이트)
  - [ ] api/send-email.js (Vercel 이메일 footer 업데이트)
  - [ ] README.md

### 5️⃣ **랜딩페이지 5개사만 표시**
- **문제**: 8개 보험사 중 5개만 표시됨 (거짓!)
- **실제**: 8개 모두 정의되어 있으나 기본 표시가 3개
- **수정**: InsuranceComparison.jsx 라인 292-295
  ```javascript
  // 변경 전: displayedCompanies.slice(0, 3)
  // 변경 후: displayedCompanies.slice(0, 8) 또는 displayedCompanies
  ```

### 6️⃣ **법적 준칙 미흡**
- **문제**: Gemini 법률 자문 미적용
- **필요**: 면책 공고, 확정적 표현 제거
- **수정 파일**:
  - src/App.jsx (면책 공고 강화)
  - src/components/InsuranceComparison.jsx (법적 주의사항)

---

## 📂 프로젝트 구조

```
petcare-plus-v2/
├── src/
│   ├── App.jsx                    # 메인 앱 (폼, 헤로 섹션)
│   ├── main.jsx                   # React 진입점
│   ├── components/
│   │   ├── AIRecommendation.jsx   # AI 추천 시스템
│   │   ├── ChatBot.jsx            # Claude API 챗봇
│   │   ├── HospitalFinder.jsx     # Google Maps 병원검색
│   │   ├── InsuranceComparison.jsx # 8개사 비교표 ⚠️ 중요
│   │   └── ClaimProcess.jsx       # 청구 프로세스
│   └── utils/
│       ├── analytics.js           # Google Analytics
│       └── contentGenerator.js    # 콘텐츠 자동생성
│
├── api/
│   └── send-email.js              # Vercel 이메일 함수 ⚠️ 중요
│
├── api-server.js                  # 로컬 API 서버 ⚠️ 중요
├── index.html                     # HTML 템플릿 ⚠️ 보안 문제!
├── vite.config.js                 # Vite 설정 (API 프록시)
├── package.json                   # 의존성
├── .env.example                   # 환경변수 템플릿
├── .env.local                     # 실제 API 키 (git 무시)
├── .gitignore                     # git 무시 파일
├── CLAUDE.md                      # 이 파일
└── README.md                      # 프로젝트 설명

⚠️ = 현재 수정 필요한 파일
```

---

## 🔧 환경 변수 설정 (필수!)

### .env.local 필수 항목

```bash
# ⚠️ 이것이 이메일/지도가 안 되는 이유입니다!

# 1️⃣ Claude API (챗봇용)
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
# → https://console.anthropic.com에서 발급

# 2️⃣ Supabase (데이터베이스)
VITE_SUPABASE_URL=https://cpejxivbyvlpkmthgwfq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
# → 이미 설정됨 ✅

# 3️⃣ Resend (이메일 발송) ⚠️ 미설정
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
# → https://resend.com에서 무료 가입 후 발급
PETCARE_ADMIN_EMAIL=your_email@gmail.com
# → 상담 신청 받을 이메일 주소

# 4️⃣ Google Maps (동물병원 검색) ⚠️ 미설정
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
# → https://console.cloud.google.com에서 발급
# → Places API 활성화 필수!
```

---

## 🚀 로컬 개발 실행

```bash
# 1단계: 종속성 설치
npm install

# 2단계: 환경 변수 설정
cp .env.example .env.local
# 위의 4가지 API 키를 .env.local에 설정

# 3단계: 두 개 서버 동시 실행
npm run dev:full

# 이것이 자동으로 실행됨:
# - Vite Dev Server (포트 5174)
# - API Server (포트 3001)

# 또는 따로 실행:
npm run dev           # 터미널 1: Vite 개발 서버
npm run api-server    # 터미널 2: API 서버
```

---

## ✅ 테스트 체크리스트

### 배포 전 필수 테스트

```
로컬 개발 환경:
- [ ] npm run dev:full 실행 성공
- [ ] http://localhost:5174 접속 가능
- [ ] ChatBot 챗봇 작동 (우측 하단)
- [ ] Hospital Finder 지도 표시 (Google Maps)
- [ ] 상담 신청 폼 이메일 수신 확인

Vercel 배포:
- [ ] Vercel에 환경변수 설정
- [ ] https://petcare-plus.vercel.app 배포됨
- [ ] 배포된 사이트에서 이메일 발송 확인
- [ ] 배포된 사이트에서 Google Maps 작동 확인
```

---

## 🔐 보안 주의사항

### 현재 보안 위험 ⚠️

1. **Google Maps API 키 노출**
   - 파일: index.html 라인 35
   - 문제: 공개 저장소에 API 키가 하드코딩되어 있음
   - 위험: 누구나 이 키를 사용해서 비용 발생 가능
   - **해결**: 즉시 제거하고 환경변수로 변경 필수!

2. **.env.local이 .gitignore에 포함**
   - ✅ 올바른 설정 (API 키가 노출되지 않음)

3. **API 키 관리**
   - ✅ .env.local: 로컬 개발용 (git 무시)
   - ✅ Vercel Environment Variables: 프로덕션 배포 (안전)

---

## 📊 8개 보험사 최신 정보 (2026.02.28 기준)

### Gemini AI 법률자문 기반

| # | 보험사 | 상품명 | 특징 | 월 보험료 |
|----|--------|--------|------|---------|
| 1 | 메리츠 | 펫퍼민트 | 점유율 1위, 제휴병원 많음 | 25,000~ |
| 2 | 삼성 | 위풍댕댕 | 치과 특화, 다견 할인 | 28,000~ |
| 3 | DB | 펫블리 | 슬개골 특화, 12세까지 | 23,000~ |
| 4 | 현대 | 굿앤굿우리펫 | 100% 보장, 가성비 | 26,000~ |
| 5 | KB | 금쪽같은펫 | MRI/CT 최고, 대형견 | 30,000~ |
| 6 | 한화 | 시그니처 | **2026년 신상품** 🆕 | 32,000~ |
| 7 | 농협 | NH가성비굿 | 배상책임 높음 | 26,000~ |
| 8 | 롯데 | let:click | 저렴, 간편 가입 | 24,000~ |

---

## 📋 중요: Gemini 법률 자문 사항

### 사전 심의 없이 법적으로 안전하게 운영하는 방법

✅ **권장 전략**:
1. **면책 공고 추가**: "본 페이지는 보험 상품 권유가 아닌 정보 제공" 명시
2. **상담명 변경**: "펫보험 가입" → "펫 라이프 맞춤 설계 리포트"
3. **확정적 표현 제거**: "최저가", "무조건 보상" 등 사용 금지
4. **정보 추상화**: 구체적 수치보다 "범위 제시" 방식 사용

❌ **하면 안 되는 것**:
- 특정 상품 강제 권장
- "이것만 가입하세요" 식 표현
- 수익률/환급률 언급
- 보험사별 순위 매기기

---

## 🔄 지속적 개선 항목

### Phase 1: 현재 (2026.02.28) - 6가지 긴급 이슈 해결
- [ ] 이메일 발송 복구 (⚠️ 최우선)
- [ ] Google Maps 보안 수정 (⚠️ 긴급)
- [ ] UI 레이아웃 통일
- [ ] 신규 사업자 정보 반영
- [ ] 8개사 완전 노출
- [ ] 법적 준칙 적용

### Phase 2: 자율진화형 플랫폼 (2026.03 착수) 🚀
**비전**: Claude Code + Claude API를 활용한 완전 자동화 플랫폼

#### 2-1. 보험 데이터 자동 갱신 시스템
- [ ] Supabase 테이블 설계 (insurance_companies, insurance_products, monthly_premiums)
- [ ] InsuranceComparison.jsx 하드코딩 제거 → DB 연동
- [ ] 자동 데이터 동기화 스크립트 (매일 자정)
  - 보험사 공식 API 또는 웹 스크래핑
  - 변경사항 자동 감지 (Diff 비교)
  - 관리자 승인 후 자동 반영
- [ ] 보험료/보장 변경 시 자동 이메일 알림
- [ ] 블로그/SNS 자동 콘텐츠 생성 ("OO 보험사, 보험료 인상...")

#### 2-2. Analytics Module 고도화
- [ ] 사용자 행동 추적 (클릭, 스크롤, 체류시간)
- [ ] 실시간 데이터 수집 및 저장 (Supabase)
- [ ] AI 기반 자동 최적화 제안
  - Claude API로 성능 분석
  - UI/UX 개선안 자동 도출
  - A/B 테스트 자동 제안
- [ ] 대시보드 시각화

#### 2-3. Content Generator 통합 및 자동화
- [ ] 일일 블로그 포스트 자동 생성 (1500-2000자, SEO 최적화)
  - 주제: 펫보험 정보, 보험사 뉴스, 동물건강 정보
  - 자동 초안 생성 → 관리자 수동 검토 (선택)
  - Supabase에 자동 저장
- [ ] SNS 콘텐츠 자동 생성 (시간별)
  - Instagram: 해시태그, 이모지, 이미지 프롬프트
  - Twitter: 280자 최적화, 바이럴 전략
  - Facebook: 캐주얼, 장문 콘텐츠
- [ ] 주간 뉴스레터 자동화
- [ ] 자동 콘텐츠 스케줄링 및 발행

#### 2-4. 자율진화 피드백 루프 구현
```
데이터 수집 (Analytics)
    ↓
AI 분석 및 개선안 도출 (Claude API)
    ↓
자동 배포 (의사결정 규칙)
    ↓
사용자 피드백 수집
    ↓
[Loop → 1번으로 돌아감]
```
- [ ] 자동화 수준: 90% 이상 목표
- [ ] 인간 개입: 최종 검수/승인만

#### 2-5. 자동 A/B 테스트
- [ ] 버튼 색상, 문구, 레이아웃 자동 테스트
- [ ] 통계적 유의성 자동 판정
- [ ] 성공률 높은 버전 자동 채택

### Phase 3: 고급 기능 (향후)
- [ ] 사용자 커뮤니티 기능
- [ ] 보험사 맞춤형 마케팅
- [ ] 모바일 앱 (iOS/Android)
- [ ] 실시간 보험료 계산기
- [ ] 국제 확장 (영문 지원)

---

## 📞 문제 발생 시 대응 방법

### 이메일이 안 올 때
```
확인 사항:
1. .env.local에 RESEND_API_KEY 설정되어 있나?
2. api-server.js 또는 api/send-email.js 실행 중인가?
3. 콘솔에 "❌ RESEND_API_KEY 환경변수 없음" 에러는?
4. Resend 대시보드에서 이메일 로그 확인

해결:
→ https://resend.com에서 무료 API 키 발급
→ .env.local에 설정
→ 서버 재시작
```

### Google Maps가 안 보일 때
```
확인 사항:
1. index.html 라인 35에서 하드코딩된 키 제거했나?
2. .env.local에 VITE_GOOGLE_MAPS_API_KEY 설정했나?
3. Google Cloud Console에서 Places API 활성화했나?
4. API 키 제약 설정에서 "제한 안 함"으로 했나?

해결:
→ Google Cloud Console에서 새 API 키 생성
→ .env.local에 설정
→ index.html에서 하드코딩된 키 완전 제거
→ 서버 재시작
```

### 배포 후 이메일이 안 올 때
```
확인 사항:
1. Vercel Environment Variables에 API 키가 모두 설정되어 있나?
2. Vercel Deployments → Function Logs에서 에러 확인
3. Spam 폴더 확인 (Resend에서 자동으로 스팸 처리될 수 있음)

해결:
→ Vercel Dashboard → Settings → Environment Variables 확인
→ RESEND_API_KEY, PETCARE_ADMIN_EMAIL 설정 여부 확인
→ 재배포 (git push)
```

---

## 🎓 사업자 정보 (2026.02.27 기준)

**사업명**: 수인AI브릿지
**사업자등록번호**: 151-09-03201
**대표자**: 이희천
**개업일**: 2026년 02월 25일
**주소**: 경기도 수원시 영통구
**연락처**: 010-5650-0670
**이메일**: hejunl@hanmail.net

**서비스**:
- AI 기반 펫보험 비교 플랫폼 (PetCare+)
- 24시간 무료 AI 상담 (Claude API)
- 8개 보험사 실시간 비교

**중요**: 본인의 이름과 연락처는 최소화하고, AI 챗봇이 대부분의 상담을 처리하도록 설계되어 있습니다.

---

## 📝 최근 변경사항 기록

### ⚙️ 2026-02-28 업데이트 (Claude Code)

**✅ 완료된 작업**:
1. **API 키 설정** (모두 최신 버전)
   - ✅ Google Maps API: `AIzaSyA6fpCsRkDi4YyRmHxM-E3ToEvNeAhDjD8`
   - ✅ Resend API: `re_HDpESPkP_CrUcH23u1o7HmRN6RECA2YHY`
   - ✅ Claude API: `sk-ant-api03-...`
   - ✅ Supabase URL: `https://cpejxivbyvlpkmthgwfg.supabase.co`
   - ✅ Supabase Key: `sb_publishable_Ig2oRfISXQ25KjDSkoS6Yg_QZ19wNr-`
   - ✅ 상담 이메일: `hejunl@hanmail.net`

2. **사업자 정보 업데이트** (최신 사업자등록증 기준)
   - 상호: 수인AI브릿지
   - 사업자등록번호: 151-09-03201
   - 개업일: 2026년 02월 25일
   - 주소: 경기도 수원시 영통구
   - 대표자명: 이희천 (변경: 이희전 → 이희천)

3. **CLAUDE.md 업데이트**
   - ✅ 담당자 정보 변경 (라인 5)
   - ✅ 4️⃣ 신규 사업자 정보 섹션 업데이트 (라인 65-72)
   - ✅ 미래에셋금융서비스 섹션 → 사업자 정보로 변경 (라인 381-398)
   - ✅ .env.local 변경사항 기록

**📝 수정된 파일**:
- `.env.local`: API 키 + 비즈니스 정보 설정
- `CLAUDE.md`: 담당자/사업자 정보 + 변경사항 기록

**🔴 아직 남은 작업** (다음 단계):
- [ ] `src/App.jsx` footer에 최신 사업자 정보 반영
- [ ] `api-server.js` 이메일 footer 업데이트
- [ ] `api/send-email.js` Vercel 이메일 footer 업데이트
- [ ] `README.md` 사업자 정보 업데이트

---

### 📌 이전 커밋 정보
```
커밋: 8ff5584
메시지: "기능: Vercel 배포 및 로컬 개발 환경 완성"
날짜: 2026-02-28
변경사항:
- Vercel API Routes (api/send-email.js) 생성
- 보안 강화 (.env.local에서 API 키 제거)
- 배포 가이드 업데이트
```

---

## 🤖 Claude Code에서 프로젝트 상태 확인 방법

### 매번 작업 시작할 때
```
"현재 petcare-plus-v2 프로젝트 상태를 CLAUDE.md에서 읽고 진행해줘"

또는

"petcare-plus-v2의 6가지 이슈 현황을 보여줘"

또는

"이메일 발송 기능을 고쳐줘" (자동으로 CLAUDE.md 참고)
```

### 이 문서를 항상 최신 상태로 유지하세요!
- 새로운 이슈 발생 시 즉시 추가
- 완료된 항목은 체크 표시
- 변경사항이 있으면 "마지막 업데이트" 날짜 변경

---

## 🚀 **자율진화형 플랫폼 핵심 설계 원칙** (사용자 반복 강조)

### **사용자 요청 (2026-02-28)**
> **"최초 사업계획서의 자율진화형 플랫폼을 참고하여 Claude Code를 유연화하여 자율진화형으로 더 확장하도록 수정합니다."**
> **"Claude Code를 활용하여 플랫폼 내에서 귀하가 자율진화형으로 직접 블로그등을 제어할 수 있도록 SNS마케팅도 귀하가 직접 작업할 수 있으므로 플랫폼으로 처음부터 다시 짜다."**
> **"위 1번, 2번은 특히 반복을 강조합니다. 대처하여 수정하세요. 모든 개선 사항도 기억 저장이 필요합니다."**

### **구현된 솔루션**

#### 1️⃣ **기존의 문제점** (해결됨)
```
❌ ContentGenerator.js → Claude API → 초안 생성
   → 관리자 승인 필요 → 배포 (인간 개입 필수)
```

#### 2️⃣ **새로운 자율진화 시스템** (구현중)
```
✅ Analytics (데이터 수집)
    ↓
✅ Claude Code Agent (자율 분석 & 실행)
├─ 블로그 주제 선택 (자동)
├─ 콘텐츠 작성 (자동, Claude API)
├─ SNS 배포 (자동, 플랫폼별 최적화)
└─ 성과 분석 (자동)
    ↓
✅ AI Optimization (자동 개선)
├─ 사용자 피드백 분석
├─ 성능 메트릭 분석
└─ 다음 콘텐츠 자동 조정
    ↓
✅ [Loop → 데이터 수집으로 돌아감]

🔑 **인간 역할**: 최종 검수/승인만 (모든 작업 완료 후)
🔑 **자동화도**: 90% 이상
```

#### 3️⃣ **구현 문서**
- ✅ **AUTONOMOUS_PLATFORM_DESIGN.md** (상세 아키텍처)
- ✅ **6가지 Task별 구현 계획** (코드 레벨)
- ✅ **Supabase 데이터 구조** (테이블 설계)
- ✅ **Admin Dashboard 설계** (모니터링 UI)

---

**프로젝트 상태**: 🟢 **설계 완료 → 구현 착수 준비**
**우선순위**:
1. 🔴 6가지 긴급 이슈 해결 (1-2주)
2. 🟡 Phase 2 자율진화 구현 (6-8주)
3. 🟢 완전 자동화 플랫폼 완성 (2026년 5월)
