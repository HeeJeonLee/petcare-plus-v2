/**
 * 🔐 Supabase Admin SDK
 * 서버 측 데이터 접근용 (API 라우트)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase 환경변수 미설정');
}

// Admin SDK (서버 측 - 모든 권한)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  }
});

export default supabaseAdmin;

/**
 * ✅ 데이터 쿼리 헬퍼 함수들
 */

export async function getRecentConsultations(limit = 10) {
  const { data, error } = await supabaseAdmin
    .from('consultant_inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('❌ 상담 조회 오류:', error);
    return [];
  }
  return data;
}

export async function getTodayStats() {
  const today = new Date().toISOString().split('T')[0];

  const { count } = await supabaseAdmin
    .from('consultant_inquiries')
    .select('*', { count: 'exact' })
    .gte('created_at', `${today}T00:00:00`)
    .lt('created_at', `${today}T23:59:59`);

  return { todayCount: count || 0 };
}

export async function logContentGeneration(contentType, title, status = 'success') {
  try {
    const { data, error } = await supabaseAdmin
      .from('content_logs')
      .insert({
        content_type: contentType,
        title,
        status,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.warn('⚠️ 콘텐츠 로그 저장 불가:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.warn('⚠️ 콘텐츠 로그 저장 실패:', err);
    return null;
  }
}
