# 🎯 PetCare+ 완전 초보자용 단계별 가이드

**작성일**: 2026-02-28
**목표**: 6가지 이슈를 초보자도 쉽게 따라할 수 있도록 설명
**난이도**: ⭐⭐ (어렵지 않음, 천천히 읽으며 따라하면 됨)

---

## 📋 목차
1. 프로젝트 상태 검증 결과
2. 6가지 이슈 상세 설명 (무엇인가? 왜인가? 어떻게 하나?)
3. 순서대로 따라하기 (copy-paste 가능)
4. 각 단계마다 검증하기
5. 배포하기

---

## ✅ 검증 결과 (전체 현황)

### 6가지 이슈 중 현황

| # | 이슈 | 상태 | 심각도 | 예상 난이도 |
|---|------|------|--------|----------|
| 1 | 이메일 발송 미작동 | 🟡 **반쯤 완성** | 🔴 높음 | ⭐⭐ 낮음 |
| 2 | Google Maps 보안 위험 | 🔴 **긴급** | 🔴 매우 높음 | ⭐⭐⭐ 중간 |
| 3 | UI/UX 불일치 | 🟡 **확인 필요** | 🟡 중간 | ⭐ 매우 낮음 |
| 4 | 신규 사업자 정보 | ✅ **이미 설정됨** | 🟢 없음 | ✅ 완료 |
| 5 | 8개사 완전 표시 | 🟡 **부분 해결** | 🟡 중간 | ⭐⭐ 낮음 |
| 6 | 법적 준칙 강화 | 🟡 **부분 적용** | 🟡 중간 | ⭐⭐⭐ 중간 |

**빨간색(긴급) 먼저, 노란색(권장), 초록색(완료) 순서로 진행**

---

## 🔍 각 이슈 상세 분석

### ✅ 이슈 4: 신규 사업자 정보 (이미 설정됨)

**검증 결과**: ✅ **완료** - 이미 모두 설정되어 있습니다!

**.env.example 파일에서 확인:**
```
VITE_BUSINESS_NAME=수인AI브릿지                    ✅
VITE_BUSINESS_REGISTRATION_NUMBER=151-09-03201    ✅
VITE_BUSINESS_START_DATE=2026-02-25               ✅ 신규 개업일 설정됨
VITE_COMPANY_ADDRESS=수원시 팔달구                  ✅
```

**무엇을 하나요?**: 이미 모두 설정되어 있으므로 **별도로 할 일이 없습니다**. ✅

---

### 🔴 이슈 2: Google Maps 보안 위험 (긴급!!!)

**심각도**: 🔴 **이것을 먼저 해야 합니다!**

**무엇이 문제인가?**
- 당신의 Google Maps API 키가 **공개 저장소에 노출**되어 있습니다
- 누구든지 이 키를 사용해서 구글 지도 서비스를 이용할 수 있습니다
- 이는 당신의 계정에서 **요금이 청구될 수 있다**는 뜻입니다!

**왜 발생했나?**
```html
<!-- index.html 라인 35 -->
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA6fpCsRkDi4YyRmHxM-E3ToEvNeAhDjD8&libraries=places&language=ko"></script>
```
위처럼 HTML에 API 키를 **직접 작성**했기 때문입니다.

**어떻게 고치나?**

#### Step 1: 기존 API 키 사용 중지 (5분)

1. Google Cloud Console 접속: https://console.cloud.google.com
2. 로그인 (당신의 구글 계정)
3. 좌측 메뉴에서 **"API 및 서비스"** → **"사용자 인증 정보"** 클릭
4. 테이블에서 **"AIzaSyA6fpCsRkDi4YyRmHxM-E3ToEvNeAhDjD8"** 찾기
5. 클릭 후 **"삭제"** 버튼 클릭
6. **"삭제"** 확인

**이유**: 이미 노출된 키이므로 폐기해야 합니다.

#### Step 2: 새로운 API 키 발급 받기 (10분)

1. Google Cloud Console에서 **"+ 사용자 인증 정보 만들기"** 클릭
2. **"API 키"** 선택
3. 새로운 키가 생성됩니다: `AIzaSy...` (긴 문자열)
4. **이 키를 복사해두세요**

#### Step 3: .env.local 파일 수정 (1분)

1. 프로젝트 폴더에서 `.env.local` 파일을 엽니다
2. 16번 라인을 찾습니다:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```
3. 다음처럼 변경합니다 (Step 2에서 복사한 키 사용):
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy... (Step 2에서 받은 키)
   ```
4. 저장합니다

#### Step 4: index.html 수정 (위험한 키 제거) (2분)

1. `index.html` 파일을 엽니다
2. 35번 라인을 찾습니다:
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA6fpCsRkDi4YyRmHxM-E3ToEvNeAhDjD8&libraries=places&language=ko"></script>
   ```
3. 다음처럼 변경합니다:
   ```html
   <!-- 주의: API 키는 .env.local에서 로드됨 -->
   <!-- 환경변수: VITE_GOOGLE_MAPS_API_KEY -->
   ```
4. 저장합니다

**검증하기**:
```bash
# 터미널에서 실행
npm run dev

# 브라우저에서 http://localhost:5174 접속
# "주변 동물병원 찾기" 클릭 → 지도 표시되는지 확인
```

---

### 🟡 이슈 1: 이메일 발송 미작동

**심각도**: 🟡 **높음** (사용자가 이메일을 받지 못함)

**무엇이 문제인가?**
- 상담 신청 폼을 제출해도 이메일이 전달되지 않습니다
- 코드는 완벽하지만, **API 키가 설정되지 않았기 때문**입니다

**왜 발생했나?**
```javascript
// api-server.js 라인 140-147
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY 환경변수 없음');
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'RESEND API key missing' }));
  return;
}
```
위 코드가 API 키를 찾지 못했기 때문입니다.

**어떻게 고치나?**

#### Step 1: Resend 가입 (5분)

1. 브라우저에서 https://resend.com 접속
2. **"Sign up"** 클릭
3. 이메일 입력 후 가입
4. 이메일 인증 (이메일로 온 링크 클릭)

#### Step 2: API 키 발급 받기 (2분)

1. Resend 대시보드 로그인
2. 좌측 메뉴 **"API Keys"** 클릭
3. **"Create API Key"** 버튼 클릭
4. 이름 입력: `PetCare+ Local` (아무거나 괜찮음)
5. **"Create"** 클릭
6. 새로운 키가 표시됨: `re_...` (긴 문자열)
7. **이 키를 복사해두세요**

#### Step 3: .env.local 수정 (1분)

1. `.env.local` 파일 열기
2. 라인 10 찾기:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   ```
3. 다음처럼 변경:
   ```
   RESEND_API_KEY=re_... (Step 2에서 받은 키)
   ```
4. 라인 14 확인:
   ```
   PETCARE_ADMIN_EMAIL=your_email@example.com
   ```
5. 다음처럼 변경 (당신의 이메일):
   ```
   PETCARE_ADMIN_EMAIL=your.email@gmail.com
   ```
6. 저장

#### Step 4: API 서버 실행 (1분)

**터미널 1에서**:
```bash
npm run api-server
```

출력 예시:
```
✅ .env.local 파일 로드 완료
🚀 API Server running on http://localhost:3001
📧 /api/send-email endpoint ready
🔑 RESEND_API_KEY: ✅ Loaded
```

**"✅ Loaded"가 표시되면 성공입니다!**

#### Step 5: Vite 개발 서버 실행 (1분)

**터미널 2에서** (터미널 1은 그대로 실행):
```bash
npm run dev
```

출력 예시:
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5174/
  ➜  press h to show help
```

#### Step 6: 이메일 테스트 (5분)

1. 브라우저에서 http://localhost:5174 접속
2. 하단의 **"펫 라이프 맞춤 설계 리포트 신청"** 섹션 찾기
3. 폼 작성:
   - 이름: `테스트`
   - 연락처: `010-1234-5678`
   - 이메일: (비워두거나 입력)
   - 반려동물: `강아지` 선택
   - 나이: `3세` 선택
   - 상담 내용: `테스트입니다`
4. **제출** 클릭

#### Step 7: 이메일 확인 (2분)

1. **당신의 이메일** (PETCARE_ADMIN_EMAIL로 설정한 주소) 확인
2. 받은편지함에 **"[PetCare+] 새 상담 신청"** 이메일 도착 확인

**이메일 내용 예시**:
```
🐾 PetCare+
새로운 상담 신청이 접수되었습니다!

📋 신청자 정보
이름: 테스트
연락처: 010-1234-5678
반려동물: 강아지 / 3세
...
```

**검증 완료!** ✅

---

### 🟡 이슈 3: UI/UX 불일치

**심각도**: 🟡 **낮음** (시각적 문제)

**무엇이 문제인가?**
- 상단 3개 버튼이 다른 크기/모양으로 보일 수 있습니다

**어디 있나?**
- App.jsx 라인 179-200

**현재 상태**:
```jsx
<div className="flex flex-col md:flex-row gap-4 justify-center items-center">
  <a className="px-8 py-4 bg-white ...">
    🎯 AI 맞춤 추천 받기
  </a>
  <a className="px-8 py-4 bg-transparent border-2 ...">
    📊 8개사 상세 비교
  </a>
  <a className="px-8 py-4 bg-yellow-400 ...">
    📥 사업계획서 다운로드
  </a>
</div>
```

**해결 방법**:

모든 버튼에 동일한 스타일 적용:
```jsx
<div className="flex flex-col md:flex-row gap-4 justify-center items-center">
  <a
    href="#ai-recommendation"
    className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
  >
    🎯 AI 맞춤 추천 받기
  </a>
  <a
    href="#comparison"
    className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
  >
    📊 8개사 상세 비교
  </a>
  <a
    href="/documents/PetCare+_사업계획서.pptx"
    download
    className="px-8 py-4 bg-white text-pink-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
  >
    📥 사업계획서 다운로드
  </a>
</div>
```

**차이점**:
- 모든 버튼: `px-8 py-4` (동일 크기)
- 모든 버튼: `rounded-full font-bold text-lg` (동일 스타일)
- 모든 버튼: `shadow-lg transform hover:scale-105` (동일 호버 효과)
- 배경: 모두 `bg-white` + 글자색 다름 (`text-blue-600`, `text-purple-600`, `text-pink-600`)

---

### 🟡 이슈 5: 8개사 완전 표시

**심각도**: 🟡 **중간**

**무엇이 문제인가?**
- 랜딩 페이지에 8개 보험사가 모두 표시되지 않을 수 있습니다

**현재 상태**:
- InsuranceComparison.jsx에는 8개사가 **모두 정의되어 있습니다** ✅
- 라인 11-245: `insuranceCompanies` 배열에 8개 모두 포함됨

**왜 표시 안 될 수 있나?**
- 테이블/리스트 렌더링 부분에서 처음 3개만 표시할 수 있음

**해결 방법**:

InsuranceComparison.jsx에서 테이블 렌더링 부분을 찾아 다음처럼 수정:

```javascript
// 변경 전 (예상)
displayedCompanies.slice(0, 3)  // 처음 3개만 표시

// 변경 후
displayedCompanies  // 모두 표시
// 또는
displayedCompanies.slice(0, 8)  // 8개 명시적으로 표시
```

---

### 🟡 이슈 6: 법적 준칙 강화

**심각도**: 🟡 **중간** (법적 안전성)

**무엇이 문제인가?**
- 확정적 표현이 많아서 법적 문제가 될 수 있습니다
- 예: "최저가", "무조건 보상" 등

**어디를 수정하나?**

#### App.jsx 라인 239 수정:

**변경 전**:
```jsx
<h2 className="text-4xl font-bold">💬 무료 상담 신청</h2>
```

**변경 후** (이미 적용됨):
```jsx
<h2 className="text-4xl font-bold">💬 펫 라이프 맞춤 설계 리포트 신청</h2>
```
✅ 이미 변경됨

#### 추가로 추가할 면책 공고:

App.jsx 상단에 추가:
```jsx
// 법적 면책 배너
<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
  <p className="text-sm text-yellow-700">
    ⚠️ 본 페이지는 보험 상품의 정보 제공을 목적으로 하며, 보험 가입을 강제하거나 특정 상품을 추천하지 않습니다.
    개인의 상황에 맞는 보험 선택은 전문가 상담을 통해 결정하시기 바랍니다.
  </p>
</div>
```

---

## 🚀 순서대로 따라하기

### 우선순위 순서

**1순위 (긴급)**: Google Maps 보안 제거 (15분)
↓
**2순위 (중요)**: 이메일 발송 복구 (20분)
↓
**3순위 (권장)**: UI 통일, 8개사 표시, 법적 준칙 (30분)

---

## 📝 체크리스트

**Google Maps (15분)**
- [ ] Step 1: 기존 API 키 삭제
- [ ] Step 2: 새 API 키 발급
- [ ] Step 3: .env.local 수정
- [ ] Step 4: index.html 수정
- [ ] 검증: 지도 표시 확인

**이메일 (20분)**
- [ ] Step 1: Resend 가입
- [ ] Step 2: API 키 발급
- [ ] Step 3: .env.local 수정
- [ ] Step 4: API 서버 실행
- [ ] Step 5: Vite 개발 서버 실행
- [ ] Step 6: 폼 제출 테스트
- [ ] Step 7: 이메일 수신 확인

**UI/UX (10분)**
- [ ] 3개 버튼 스타일 통일

**8개사 표시 (5분)**
- [ ] 테이블 렌더링 부분 확인
- [ ] slice(0, 8) 적용

**법적 준칙 (5분)**
- [ ] 면책 공고 배너 추가

---

## ❓ 자주 묻는 질문

### Q: 이메일이 스팸함으로 가요
**A**: Resend 설정에서 발신인 인증을 확인하세요.

### Q: Google Maps가 여전히 안 보여요
**A**: 1. 브라우저 새로고침 (Ctrl+F5)
   2. node_modules 삭제 후 npm install
   3. 개발 서버 재시작

### Q: API 키를 잃어버렸어요
**A**: Google Cloud Console에서 새로운 키를 발급받으면 됩니다.

### Q: .env.local 파일이 안 보여요
**A**: VS Code에서 Ctrl+Shift+P → "Show Hidden Files" 검색

---

## 🎯 다음 단계

위 6가지 이슈를 모두 해결한 후:
1. `npm run dev:full` 실행
2. 모든 기능 테스트
3. 배포 (Vercel)

---

**준비되셨나요? 이제 시작해보세요!** 🚀
