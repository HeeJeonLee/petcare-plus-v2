# PetCare+ Vercel 배포 가이드

## 📋 현재 상황

- ✅ 로컬 개발: 완료 (API 서버, 이메일 시스템 구축)
- ⚠️ 이메일 전송: 개발 환경의 DNS 제약으로 인해 불가
- 🚀 **프로덕션**: Vercel 배포 필요

## 단계별 배포 가이드

### 1단계: GitHub에 푸시 (이미 완료)

```bash
git push -u origin claude/initial-setup-YBsua
```

### 2단계: Vercel 연동

1. **Vercel 계정 생성**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 import**
   - "New Project" 클릭
   - GitHub 저장소 선택: `HeeJeonLee/petcare-plus-v2`
   - Branch 선택: `claude/initial-setup-YBsua`

3. **환경변수 설정**
   ```
   RESEND_API_KEY = re_JTJtjqWD_Lhqv3kNz4vaZaTdXopomf8qm
   PETCARE_ADMIN_EMAIL = hejunl@hanmail.net
   PETCARE_FROM_EMAIL = noreply@petcare-plus.com
   ```

4. **배포**
   - "Deploy" 클릭
   - 배포 완료 대기 (~2-3분)

### 3단계: 배포 후 구조

```
Vercel 배포 후:
├── Frontend (Next.js/React)
│   └── https://petcare-plus.vercel.app
└── API Routes (Serverless Functions)
    ├── /api/send-email
    └── /api/analytics
```

## API 서버 배포 옵션

### 옵션 A: Vercel Functions 사용 (권장)

현재 `api/send-email.js`를 Vercel Functions로 사용:

```bash
# api/ 디렉토리는 자동으로 Vercel Functions로 변환됨
npm run build
```

### 옵션 B: 별도 서버로 배포

`api-server.js`를 별도로 배포:
- Railway.app
- Heroku
- DigitalOcean

## 배포 후 테스트

### 1. 웹 접속
```
https://petcare-plus.vercel.app
```

### 2. 이메일 테스트
- "💬 AI 무료 상담 신청" 폼 작성
- 제출 클릭
- hejunl@hanmail.net으로 이메일 도착 확인

### 3. 로그 확인
- Vercel Dashboard → Deployments → Function Logs

## 환경 변수 보안

### 주의: 공개된 정보

현재 노출되는 정보:
- 사업자등록번호: `151-09-03201` (공개)
- 회사명: `수인AI브릿지` (공개)

### 보호할 정보

다음은 **절대 공개하면 안 됨**:
- ❌ `RESEND_API_KEY` (발급받은 API 키)
- ❌ `hejunl@hanmail.net` (개인 이메일)

**해결책**: Vercel의 Environment Variables에만 저장
- `.env.local`은 `.gitignore`에 포함 ✅
- 소스 코드에 하드코딩 금지 ✅
- API 서버에서만 환경변수 로드 ✅

## 배포 체크리스트

- [ ] GitHub에 모든 변경 사항 커밋
- [ ] Vercel 계정 생성
- [ ] GitHub과 Vercel 연동
- [ ] 환경 변수 설정
- [ ] 배포 실행
- [ ] 배포된 URL 접속 확인
- [ ] 이메일 테스트
- [ ] 이메일 수신 확인

## 배포 후 기타 설정

### 커스텀 도메인 (선택)

Vercel에서 커스텀 도메인 연결:
1. Vercel Dashboard → Settings → Domains
2. 도메인 추가
3. DNS 레코드 업데이트

### 버전 관리

배포 후 새로운 기능 추가:
```bash
git add .
git commit -m "기능: 새로운 기능"
git push origin claude/initial-setup-YBsua
# Vercel이 자동 배포
```

## 도움말

### 배포 실패 시

1. 빌드 로그 확인
   ```
   Vercel Dashboard → Deployments → 실패한 배포 클릭
   ```

2. 환경 변수 확인
   ```
   Vercel Dashboard → Settings → Environment Variables
   ```

3. 패키지 확인
   ```bash
   npm install
   npm run build
   ```

### 이메일 받지 못했을 때

1. Spam 폴더 확인
2. Resend Dashboard에서 이메일 로그 확인
3. API 오류 로그 확인 (Vercel Functions Logs)

## 예상 결과

배포 후:
```
✅ http://localhost:5174 테스트
   ↓
🚀 https://petcare-plus.vercel.app 배포
   ↓
📧 hejunl@hanmail.net에 이메일 도착
   ↓
✨ 완성!
```

---

**배포 시간**: 2-3분
**배포 비용**: Vercel 무료 플랜 (충분함)
**이메일 비용**: Resend 무료 (매월 3000개까지)
