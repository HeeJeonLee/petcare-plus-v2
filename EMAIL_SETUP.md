# PetCare+ Email Configuration Guide

## ✅ Setup Status

The email submission system has been successfully configured with the following components:

### 1. API Server (`api-server.js`)
- **Purpose**: Handles `/api/send-email` requests
- **Port**: 3001
- **Features**:
  - Parses form data from consultation requests
  - Generates professional email HTML templates
  - Integrates with Resend API for email delivery
  - Loads environment variables from `.env.local`

### 2. Environment Configuration
- **File**: `.env.local` (로컬 개발), Vercel Dashboard (프로덕션)
- **Key Variables**:
  ```
  RESEND_API_KEY=your_resend_api_key_here
  PETCARE_ADMIN_EMAIL=your_email@example.com
  PETCARE_FROM_EMAIL=noreply@petcare-plus.com
  ```
  ⚠️ `.env.local`은 git에서 무시됩니다 (.gitignore 확인)

### 3. Vite Development Server
- **Configuration**: `vite.config.js`
- **Proxy Setup**: Routes `/api/*` requests to `localhost:3001`
- **Port**: 5174

## 🚀 How to Run

### Option 1: Run Both Servers Together
```bash
npm run dev:full
```
This runs both the Vite dev server and the API server concurrently.

### Option 2: Run Servers Separately

**Terminal 1 - API Server:**
```bash
npm run api-server
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

## 📧 Testing Email Submission

1. **Access the application:**
   - Navigate to `http://localhost:5174` in your browser

2. **Find the consultation form:**
   - Scroll to the "💬 AI 무료 상담 신청" section
   - Or jump to section with `#contact` anchor

3. **Fill out the form:**
   - 이름 (Name): Your name
   - 연락처 (Phone): Your phone number
   - 이메일 (Email): Your email address
   - 반려동물 종류 (Pet Type): Select dog (강아지) or cat (고양이)
   - 반려동물 나이 (Pet Age): Select age range
   - 상담 내용 (Message): Your consultation inquiry

4. **Submit the form:**
   - Click "📋 상담 신청하기" button
   - A success message will appear: "✅ 상담 신청이 완료되었습니다!"

## 📬 Email Delivery Process

When the form is submitted:

1. **Frontend** sends data to `/api/send-email`
2. **Vite Proxy** forwards request to `localhost:3001`
3. **API Server** receives and processes the request
4. **Email Generation** creates professional HTML template with:
   - Applicant information (name, phone, email)
   - Pet information (type, age)
   - Consultation message
   - Reception timestamp (Seoul timezone)
5. **Resend API** sends email to configured recipients
6. **Response** returned to frontend with success/error status

## 📨 Recipients

- **Primary Recipient**: Configured in `PETCARE_ADMIN_EMAIL` environment variable
- **CC Copy**: Sent to applicant's email address (if provided)
- **From Address**: Configured in `PETCARE_FROM_EMAIL` environment variable

Set these values in:
- **로컬 개발**: `.env.local` 파일
- **프로덕션**: Vercel Dashboard → Settings → Environment Variables

## 🔍 Monitoring API Requests

To see API server logs, check the terminal where you ran `npm run api-server`.

Expected log output for successful submission:
```
📧 이메일 발송 시도:
   수신처: hejunl@hanmail.net
   신청자: 테스트 고객 (010-1234-5678, customer@example.com)
   API Key: re_JTJtjqW...
✅ 이메일 발송 성공
   Message ID: <email-id>
```

## 🚀 Production Deployment (Vercel)

### Vercel API Routes
The `api/send-email.js` file is automatically deployed as a Vercel Serverless Function:
- **URL**: `https://your-domain.vercel.app/api/send-email`
- **No separate server needed** - Vercel handles the backend
- **Environment variables** are set in Vercel Dashboard

### Deployment Steps
1. Push changes to your branch
2. Vercel auto-deploys when changes are detected
3. Check Vercel Dashboard → Function Logs for errors
4. Test form submission on live URL

## ⚙️ Configuration Files

- **`.env.local`**: Local environment variables (not tracked in git)
- **`.env.example`**: Template for environment variables
- **`package.json`**: Scripts and dependencies
- **`vite.config.js`**: Vite configuration with API proxy (로컬 개발용)
- **`api-server.js`**: Standalone API server (로컬 개발용)
- **`api/send-email.js`**: Vercel Serverless Function (프로덕션용)

## 🛠️ Troubleshooting

### API Server Not Starting
- Make sure port 3001 is not in use
- Check Node.js version (v18+ recommended)
- Verify `.env.local` file exists

### Email Not Sending
- Verify `RESEND_API_KEY` is correctly set in `.env.local`
- Check API server logs for detailed error messages
- Ensure email addresses are in correct format
- Verify network connectivity to `api.resend.com`

### Form Data Not Reaching Server
- Check browser console for any errors
- Verify Vite proxy is correctly configured
- Ensure both servers are running

## 📝 Email Template

The generated email includes:
- Professional branding with PetCare+ logo
- Structured table of applicant information
- Pet information display
- Reception timestamp in Korean timezone
- Automatic CC to applicant's email
- Business registration info (151-09-03201)

## 🔐 Security Notes

- API keys are stored in `.env.local` (not in git)
- CORS is enabled for development
- Email addresses are properly escaped in HTML template
- Request validation ensures required fields are present

## 📞 Support

For issues or questions about email configuration:
1. Check API server logs
2. Verify environment variables are loaded
3. Test direct API calls using curl or Postman
4. Review email template in `api-server.js`

---

**Last Updated**: 2026-02-28
**Status**: ✅ Operational
