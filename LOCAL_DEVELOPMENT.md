# 🛠️ PetCare+ 로컬 개발 환경 설정

## 📋 필요한 것들

- Node.js v18+ (https://nodejs.org)
- npm 또는 yarn
- Resend API Key (https://resend.com)
- GitHub 계정 (선택)

## 🚀 빠른 시작

### 1단계: 환경 변수 설정

`.env.local` 파일 생성 (`.env.example`을 참고):

```bash
# 1. .env.local 파일 생성
cp .env.example .env.local

# 2. 텍스트 에디터로 열기
nano .env.local
# 또는 VS Code
code .env.local
```

`.env.local`에 다음 값들을 설정하세요:

```env
# Claude API (ChatBot용)
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here

# Supabase (데이터 저장용)
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 이메일 설정 (Resend API)
RESEND_API_KEY=re_your_actual_resend_key_here
PETCARE_ADMIN_EMAIL=your.email@example.com
PETCARE_FROM_EMAIL=noreply@petcare-plus.com

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2단계: 종속성 설치

```bash
npm install
```

### 3단계: 로컬 서버 실행

#### 옵션 A: 두 서버 한 번에 실행 (권장)

```bash
npm run dev:full
```

이 명령은 다음을 자동으로 실행합니다:
- **Vite Dev Server**: http://localhost:5174 (프론트엔드)
- **API Server**: http://localhost:3001 (이메일 등)

#### 옵션 B: 서버 따로 실행

**터미널 1 - API 서버:**
```bash
npm run api-server
```

**터미널 2 - Vite 개발 서버:**
```bash
npm run dev
```

### 4단계: 브라우저에서 확인

```
http://localhost:5174
```

## 📧 이메일 테스트

### 1. 상담 폼 찾기

- http://localhost:5174 접속
- 페이지 하단의 "💬 펫 라이프 맞춤 설계 리포트 신청" 섹션으로 이동
- 또는 "상담 신청" 링크 클릭

### 2. 폼 작성

```
이름: 테스트 고객
연락처: 010-1234-5678
이메일: test@example.com
반려동물: 강아지
반려동물 나이: 3-6세
상담 내용: 펫보험 상담 신청합니다.
```

### 3. 제출

"📋 리포트 신청하기" 버튼 클릭

### 4. 이메일 확인

- `PETCARE_ADMIN_EMAIL`로 설정한 이메일에서 받은 메일 확인
- 제목: `[PetCare+] 새 상담 신청 - 테스트 고객님`

## 🔍 디버깅

### API 서버가 시작되지 않음

```bash
# 포트 3001 확인
lsof -i :3001
# 또는 Windows
netstat -ano | findstr :3001

# 프로세스 종료
kill -9 <PID>
# 또는 Windows
taskkill /PID <PID> /F
```

### API 호출 실패

1. **API 서버 실행 확인**
   ```bash
   curl http://localhost:3001
   ```
   응답: `{"status":"API Server Running"}`

2. **환경 변수 확인**
   ```bash
   cat .env.local
   # RESEND_API_KEY가 설정되어 있는지 확인
   ```

3. **API 서버 로그 확인**
   - API 서버 실행 중인 터미널에서 에러 메시지 확인
   - `❌` 로그가 있으면 그 메시지를 읽기

### 이메일이 안 옴

1. **API 서버 로그 확인**
   ```
   ✅ 이메일 발송 성공
   또는
   ❌ 이메일 발송 실패
   ```

2. **Resend 대시보드 확인**
   - https://resend.com → Logs
   - 이메일 발송 실패 원인 확인

3. **스팸 폴더 확인**
   - Gmail, Naver, Daum 등 스팸 폴더 확인

## 🏗️ 프로젝트 구조

```
petcare-plus-v2/
├── src/
│   ├── main.jsx              # React 진입점
│   ├── App.jsx              # 메인 애플리케이션 (폼 포함)
│   ├── components/
│   │   ├── AIRecommendation.jsx
│   │   ├── ChatBot.jsx
│   │   ├── InsuranceComparison.jsx
│   │   └── HospitalFinder.jsx
│   └── utils/
│       ├── analytics.js
│       └── contentGenerator.js
│
├── api/
│   └── send-email.js        # Vercel 배포용 API (프로덕션)
│
├── api-server.js            # 로컬 개발용 API 서버
├── index.html               # HTML 템플릿
├── vite.config.js          # Vite 설정 (프록시 포함)
├── package.json            # 종속성 및 스크립트
├── .env.local              # 로컬 환경 변수 (git 무시)
└── .env.example            # 환경 변수 템플릿
```

## 📝 주요 파일 설명

### `src/App.jsx` (라인 39-107)
- 상담 폼 제출 처리
- Supabase에 데이터 저장
- `/api/send-email`로 이메일 발송 요청

### `vite.config.js`
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3001',  // API 서버로 프록시
    changeOrigin: true
  }
}
```

### `api-server.js`
- Resend API를 사용해 이메일 발송
- `/api/send-email` 엔드포인트 제공
- `.env.local`에서 환경 변수 로드

## 🔐 보안 주의사항

### ✅ 올바른 방법

1. **API 키는 `.env.local`에만 저장**
   ```bash
   # .env.local은 .gitignore에 포함되어 있음
   git status
   # .env.local이 나열되지 않으면 안전함
   ```

2. **소스 코드에 하드코딩하지 않기**
   ```javascript
   // ❌ 나쁜 예
   const API_KEY = "re_actual_key_here";
   
   // ✅ 좋은 예
   const API_KEY = process.env.RESEND_API_KEY;
   ```

3. **프로덕션은 Vercel Dashboard에서 설정**
   - 소스 코드에 절대 추가하지 않기

### ⚠️ 주의

- API 키가 GitHub에 올라가면 회수하기 어려움
- 실수로 올라간 경우 즉시 API 키 변경

## 🚀 다음 단계

### 로컬 테스트 완료 후

1. **프로덕션 배포 준비**
   ```bash
   npm run build
   ```

2. **배포 가이드 보기**
   ```
   DEPLOYMENT.md 참고
   ```

3. **Vercel 배포**
   - https://vercel.com에서 프로젝트 import
   - 환경 변수 설정
   - 자동 배포 시작

## 📞 도움말

### 자주 묻는 질문

**Q: npm run dev:full 실행 후 http://localhost:5174에 접속했는데 API 요청이 안 됨**
- A: 두 터미널 모두 로그가 없는지 확인하세요. 둘 다 실행 중이어야 합니다.

**Q: RESEND_API_KEY가 없다고 에러가 나옴**
- A: `.env.local`을 생성하고 실제 키값을 설정하세요.

**Q: 로컬에서는 이메일이 오는데 배포 후 안 옴**
- A: Vercel의 Environment Variables에 `RESEND_API_KEY` 등을 설정했는지 확인하세요.

---

**마지막 업데이트**: 2026-02-28
**상태**: ✅ 작동 중
