/**
 * 🔔 알림 시스템 API
 * 새 상담 신청 시 관리자에게 이메일 + 푸시 알림
 */

import { Resend } from 'resend';
import supabaseAdmin from './supabaseAdmin.js';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 📧 새 상담 알림 이메일 발송
 */
export async function sendConsultationNotification(consultation) {
  try {
    if (!process.env.PETCARE_ADMIN_EMAIL) {
      console.warn('⚠️ PETCARE_ADMIN_EMAIL 미설정');
      return { success: false, error: 'Admin email not configured' };
    }

    const adminEmail = process.env.PETCARE_ADMIN_EMAIL;

    // 이메일 템플릿 생성
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
    .header { background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899); color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
    .section { margin: 20px 0; padding: 15px; background: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 5px; }
    .label { font-weight: bold; color: #3b82f6; }
    .button { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    .footer { font-size: 12px; color: #999; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 새 펫보험 상담 신청</h1>
      <p>PetCare+ Admin Dashboard</p>
    </div>

    <div class="section">
      <p><span class="label">📞 고객명:</span> ${consultation.name || '미입력'}</p>
      <p><span class="label">📧 이메일:</span> ${consultation.email || '미입력'}</p>
      <p><span class="label">📱 전화:</span> ${consultation.phone || '미입력'}</p>
    </div>

    <div class="section">
      <p><span class="label">🐶 반려동물 유형:</span> ${consultation.pet_type || '미입력'}</p>
      <p><span class="label">🎂 반려동물 나이:</span> ${consultation.pet_age || '미입력'}</p>
    </div>

    <div class="section">
      <p><span class="label">💬 상담 내용:</span></p>
      <p style="white-space: pre-wrap; margin: 10px 0;">${consultation.message || '미입력'}</p>
    </div>

    <div class="section">
      <p><span class="label">⏰ 신청 시간:</span> ${new Date(consultation.created_at).toLocaleString('ko-KR')}</p>
      <p><span class="label">🆔 상담 ID:</span> ${consultation.id || 'N/A'}</p>
    </div>

    <div style="text-align: center; margin: 20px 0;">
      <a href="${process.env.VERCEL_URL || 'https://petcare-plus.vercel.app'}/?admin=true" class="button">
        관리자 대시보드 보기
      </a>
    </div>

    <div class="footer">
      <p>이 이메일은 PetCare+ 자동 알림 시스템에서 발송되었습니다.</p>
      <p>📍 ${process.env.VITE_COMPANY_ADDRESS || '서울시'}</p>
      <p>📞 ${process.env.VITE_CONSULTANT_PHONE || '010-xxxx-xxxx'}</p>
    </div>
  </div>
</body>
</html>
    `;

    // Resend API로 이메일 발송
    const result = await resend.emails.send({
      from: 'noreply@petcare-plus.com',
      to: adminEmail,
      subject: `🐾 새 펫보험 상담 신청 - ${consultation.name}`,
      html: emailHtml
    });

    console.log('✅ 알림 이메일 발송 완료:', result.id);
    return { success: true, emailId: result.id };
  } catch (err) {
    console.error('❌ 알림 이메일 발송 실패:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 🔔 Supabase에 알림 로그 저장
 */
export async function logNotification(consultation, status) {
  try {
    const notificationLog = {
      consultation_id: consultation.id,
      customer_name: consultation.name,
      customer_email: consultation.email,
      notification_type: 'email',
      status: status,
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // Supabase에 저장 (notification_logs 테이블이 있으면)
    const { data, error } = await supabaseAdmin
      .from('notification_logs')
      .insert([notificationLog]);

    if (error) {
      console.warn('⚠️ 알림 로그 저장 불가 (테이블 없음):', error.message);
      return null;
    }

    console.log('✅ 알림 로그 저장 완료');
    return data;
  } catch (err) {
    console.warn('⚠️ 알림 로그 저장 실패:', err.message);
    return null;
  }
}

/**
 * 🚨 경고 알림 (성능 저하, 에러)
 */
export async function sendAlertNotification(alertType, message) {
  try {
    const adminEmail = process.env.PETCARE_ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('⚠️ Admin email not configured');
      return;
    }

    const alertHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert { padding: 20px; border-radius: 5px; }
    .alert-error { background: #fee; border-left: 4px solid #e53e3e; }
    .alert-warning { background: #fef3c7; border-left: 4px solid #f59e0b; }
    .alert-info { background: #dbeafe; border-left: 4px solid #3b82f6; }
  </style>
</head>
<body>
  <div class="container">
    <h2>⚠️ PetCare+ 시스템 알림</h2>
    <div class="alert alert-${alertType}">
      <p><strong>알림 유형:</strong> ${alertType.toUpperCase()}</p>
      <p><strong>메시지:</strong> ${message}</p>
      <p><strong>시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
    </div>
  </div>
</body>
</html>
    `;

    await resend.emails.send({
      from: 'noreply@petcare-plus.com',
      to: adminEmail,
      subject: `⚠️ PetCare+ ${alertType.toUpperCase()} 알림`,
      html: alertHtml
    });

    console.log('✅ 경고 알림 발송:', alertType);
  } catch (err) {
    console.error('❌ 경고 알림 발송 실패:', err);
  }
}

/**
 * 📊 일일 리포트 생성
 */
export async function sendDailyReport() {
  try {
    const adminEmail = process.env.PETCARE_ADMIN_EMAIL;
    if (!adminEmail) return;

    // Supabase에서 오늘 데이터 조회
    const today = new Date().toISOString().split('T')[0];
    const { data: consultations, error } = await supabaseAdmin
      .from('consultant_inquiries')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`);

    if (error) {
      console.warn('⚠️ 일일 리포트 데이터 조회 실패');
      return;
    }

    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .stat { display: inline-block; width: 30%; text-align: center; padding: 20px; background: #f0f9ff; border-radius: 5px; margin: 10px; }
    .stat-number { font-size: 32px; font-weight: bold; color: #3b82f6; }
    .stat-label { color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>📊 ${today} 일일 리포트</h2>

    <div class="stat">
      <div class="stat-number">${consultations?.length || 0}</div>
      <div class="stat-label">새 상담</div>
    </div>

    <div class="stat">
      <div class="stat-number">${consultations?.filter(c => c.pet_type === '강아지').length || 0}</div>
      <div class="stat-label">강아지 상담</div>
    </div>

    <div class="stat">
      <div class="stat-number">${consultations?.filter(c => c.pet_type === '고양이').length || 0}</div>
      <div class="stat-label">고양이 상담</div>
    </div>
  </div>
</body>
</html>
    `;

    await resend.emails.send({
      from: 'noreply@petcare-plus.com',
      to: adminEmail,
      subject: `📊 PetCare+ 일일 리포트 - ${today}`,
      html: reportHtml
    });

    console.log('✅ 일일 리포트 발송');
  } catch (err) {
    console.error('❌ 일일 리포트 발송 실패:', err);
  }
}

// API 핸들러
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { type, consultation, message } = req.body;

    if (type === 'consultation') {
      // 새 상담 알림
      const emailResult = await sendConsultationNotification(consultation);
      await logNotification(consultation, emailResult.success ? 'sent' : 'failed');
      return res.status(200).json(emailResult);
    } else if (type === 'alert') {
      // 경고 알림
      await sendAlertNotification(message.alertType, message.content);
      return res.status(200).json({ success: true });
    } else if (type === 'daily_report') {
      // 일일 리포트
      await sendDailyReport();
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid notification type' });
  } catch (err) {
    console.error('❌ 알림 API 오류:', err);
    res.status(500).json({ error: err.message });
  }
}
