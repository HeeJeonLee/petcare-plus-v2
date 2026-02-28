# 🔍 PetCare+ 정밀 분석 보고서

**작성일**: 2026-02-28  
**분석 범위**: 전체 코드 구조 재검토  
**목표**: 모든 누락 및 문제점 파악 및 수정

---

## 📊 현재 상태 평가

### ✅ **잘 구현된 부분**

1. **UI/UX 컴포넌트**
   - ✅ AIRecommendation.jsx (AI 추천 시스템)
   - ✅ InsuranceComparison.jsx (8개사 완전 데이터)
   - ✅ ChatBot.jsx (Claude API 기반 대화)
   - ✅ HospitalFinder.jsx (Google Maps 연동)
   - ✅ ClaimProcess.jsx (청구 프로세스 가이드)

2. **데이터 관리**
   - ✅ 8개 보험사 완전한 데이터
   - ✅ 각 상품별 상세 정보 (보험료, 보장 범위, 특약 등)
   - ✅ 정렬 및 필터링 기능

3. **배포 설정**
   - ✅ Vercel 설정 (vercel.json)
   - ✅ Vite 설정
   - ✅ Tailwind CSS 완벽 적용
   - ✅ PWA 설정

---

## ❌ **문제점 분석**

### 🔴 **1단계: 하드코딩된 값들**

**파일**: `src/App.jsx`

**문제**:
```javascript
// 라인 45: Supabase URL 하드코딩
const supabaseUrl = 'https://cpejxivbyvlpkmthgwfq.supabase.co';

// 라인 66: 상담사 코드 하드코딩
consultant_code: '251220019'
```

**영향**:
- 🚨 URL이나 코드 변경 시 소스 코드 수정 필요
- 🚨 보안 위험 (실제 서비스명 노출)
- 🚨 다중 상담사 지원 불가

**해결책**:
→ 모든 상수를 `.env.example`에 정의하고 환경 변수로 전환

---

### 🔴 **2단계: 누락된 환경 변수**

**`.env.example` 확인 결과**:
```
✅ VITE_ANTHROPIC_API_KEY
✅ VITE_SUPABASE_URL
✅ VITE_SUPABASE_ANON_KEY
✅ RESEND_API_KEY
❌ VITE_CONSULTANT_CODE (누락!)
❌ VITE_CONSULTANT_PHONE (누락!)
❌ VITE_CONSULTANT_EMAIL (누락!)
❌ VITE_CONSULTANT_NAME (누락!)
```

**영향**:
- 🚨 상담사 정보가 소스 코드에만 있음
- 🚨 환경별 다른 상담사 설정 불가

---

### 🔴 **3단계: 이메일 발송 경로 불명확**

**현황**:
- **로컬**: api-server.js (포트 3001)
- **프로덕션**: api/send-email.js (Vercel Functions)

**문제**:
```javascript
// App.jsx 라인 74
await fetch('/api/send-email', {  // 이 경로가 로컬/프로덕션 모두 작동할까?
```

- 로컬: Vite proxy → localhost:3001 ✅
- 프로덕션: Vercel Functions → api/send-email.js ✅
- **하지만 명확하지 않음**

---

### 🔴 **4단계: vercel.json 환경 변수 참조 오류**

**파일**: `vercel.json`
```json
"env": {
  "RESEND_API_KEY": "@resend_api_key",  // 이게 뭐?
  "PETCARE_ADMIN_EMAIL": "@petcare_admin_email"
}
```

**문제**:
- `@` 접두사는 Vercel의 Secrets 참조 형식
- **하지만 이 값들이 실제로 Vercel에 설정되어 있나?**
- Vercel Dashboard에서 명시적으로 설정해야 함

---

### 🔴 **5단계: ChatBot 컴포넌트의 API 호출**

**파일**: `src/components/ChatBot.jsx`

**문제**:
- Claude API를 직접 프론트엔드에서 호출하는가?
- API 키가 클라이언트에 노출되는가?
- 보안 이슈는 없는가?

→ **검토 필요**

---

### 🔴 **6단계: HospitalFinder 컴포넌트**

**파일**: `src/components/HospitalFinder.jsx`

**문제**:
- Google Maps API 키 필요
- 환경 변수 설정 필수
- **Vercel에서 설정되어 있나?**

---

### 🔴 **7단계: 폼 유효성 검사 부족**

**파일**: `src/App.jsx` - 상담 신청 폼

**문제**:
```javascript
const [formData, setFormData] = useState({
  name: '',
  phone: '',
  email: '',
  petType: '',
  petAge: '',
  message: ''
});
```

- 📋 name: 공백 허용? 최소 글자수?
- 📞 phone: 형식 검증? (010-1234-5678)
- 📧 email: 유효한 이메일 확인?
- 🐾 petType, petAge: 필수?

→ **검증 로직 추가 필요**

---

### 🔴 **8단계: 오류 처리 미흡**

**파일**: `src/App.jsx` - handleSubmit 함수

```javascript
try {
  // ... Supabase 저장
  
  // 2단계: 이메일 발송
  try {
    await fetch('/api/send-email', { ... });
  } catch (emailErr) {
    console.error('이메일 발송 오류 (무시):', emailErr);  // 🚨 그냥 무시!
  }
  
  // 이메일 실패 여부 확인 안 함
  alert('✅ 상담 신청이 완료되었습니다!');  // 이메일이 안 가도 "완료"?
} catch (error) {
  // ...
}
```

**문제**:
- 이메일 발송 실패를 감지하지 않음
- 사용자에게 실패 여부를 알리지 않음
- 이메일 응답 상태 코드 미확인

---

### 🔴 **9단계: Supabase 테이블 구조 미확인**

**문제**:
```javascript
// App.jsx 라인 51
const dbRes = await fetch(`${supabaseUrl}/rest/v1/consultant_inquiries`, {
  // ...
  body: JSON.stringify({
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    pet_type: formData.petType,      // snake_case
    pet_age: formData.petAge,        // snake_case
    message: formData.message,
    consultant_code: '251220019'
  })
});
```

- ❓ consultant_inquiries 테이블이 있는가?
- ❓ 컬럼명이 정확한가? (pet_type vs petType?)
- ❓ consultant_code 컬럼이 있는가?
- ❓ 테이블 권한 설정은 올바른가?

---

### 🔴 **10단계: 보험상품 정보 최신성**

**파일**: `src/components/InsuranceComparison.jsx`

**문제**:
```javascript
const insuranceCompanies = [
  {
    id: 'meritz',
    name: '메리츠화재',
    monthlyPremium: { '1세': 22000, '3세': 25000, ... }
    // 이 정보가 2026년 최신 정보인가?
  },
  // ...
]
```

- 📅 보험료가 최신 정보인가?
- 📅 보장 범위가 정확한가?
- ⚠️ 실제 상품과 일치하는가?

---

## 📋 **종합 체크리스트**

### 로컬 개발 환경
- [ ] `.env.local` 파일 생성
- [ ] 모든 API 키 설정
- [ ] `npm install` 실행
- [ ] `npm run dev:full` 실행
- [ ] 폼 제출 테스트
- [ ] 이메일 수신 확인
- [ ] 콘솔 에러 확인

### 프로덕션 배포
- [ ] Vercel 대시보드 환경 변수 설정
- [ ] `RESEND_API_KEY` 설정
- [ ] `PETCARE_ADMIN_EMAIL` 설정
- [ ] 배포 후 빌드 로그 확인
- [ ] Function Logs 확인
- [ ] 라이브 사이트에서 폼 제출 테스트
- [ ] 이메일 수신 확인

### 코드 품질
- [ ] 모든 하드코딩된 값 제거
- [ ] 환경 변수화
- [ ] 폼 유효성 검사 추가
- [ ] 오류 처리 강화
- [ ] API 응답 검증

---

## 🎯 **다음 단계**

1. **환경 변수 정의** → `.env.example` 추가
2. **하드코딩 제거** → `src/App.jsx` 수정
3. **폼 유효성 검사** → React 컴포넌트 강화
4. **오류 처리** → try-catch 개선
5. **Supabase 확인** → 테이블 구조 검증
6. **API 명확화** → 이메일 발송 경로 문서화
7. **테스트** → 전체 플로우 검증

---

**상태**: 🚨 정밀 개선 필요  
**우선순위**: 🔴 높음 (하드코딩 제거, 환경 변수화)
