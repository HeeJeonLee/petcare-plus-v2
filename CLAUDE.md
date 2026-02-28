# 🐾 PetCare+ Claude Code 프로젝트 지침서

**프로젝트명**: PetCare+ (펫보험 AI 비교 플랫폼)
**저장소**: https://github.com/HeeJeonLee/petcare-plus-v2
**주요 담당자**: 이희전 (보험상담사/팀장)
**마지막 업데이트**: 2026-02-28

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

### 4️⃣ **신규 사업자 정보 미반영**
- **현황**: 12년 된 기존 사업자 정보 표시 중
- **변경**: 2026.02.25 신규 개업 정보로 반영 필요
- **수정 파일**:
  - src/App.jsx (footer)
  - api-server.js (이메일 footer)
  - api/send-email.js (Vercel 이메일 footer)
  - README.md

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

### Phase 1: 현재 (2026.02.28)
- [ ] 이메일 발송 복구
- [ ] Google Maps 보안 수정
- [ ] UI 레이아웃 통일
- [ ] 신규 사업자 정보 반영
- [ ] 8개사 완전 노출
- [ ] 법적 준칙 적용

### Phase 2: 향후
- [ ] 자율진화형 플랫폼 업그레이드 (Claude Code 자동화)
- [ ] 블로그 자동 생성 기능
- [ ] SNS 마케팅 자동화
- [ ] 사용자 분석 대시보드
- [ ] AI 상담 고도화

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

## 🎓 미래에셋금융서비스 GA 중요 정보

**담당자**: 이희전
**직책**: 보험상담사 (2025년 7월 등록)
**소속**: 미래에셋금융서비스 (2026년 2월 입사)
**역할**: 펫보험 전문 상담사 + 대출팀 40명 관리 팀장

**중요**: 본인의 이름과 연락처는 최소화하고, 챗봇이 대부분의 상담을 처리하도록 설계되어 있습니다.

---

## 📝 마지막 커밋 정보

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

**프로젝트 상태**: 🟠 배포 전 (6가지 이슈 수정 필요)
**우선순위**: 🔴 이메일 발송, 🔴 Google Maps 보안
