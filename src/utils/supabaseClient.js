import { createClient } from '@supabase/supabase-js';

// ✅ Supabase 클라이언트 초기화
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase 설정이 없습니다. 환경변수를 확인해주세요.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

// 📊 데이터 조회 함수들

/**
 * 상담 신청 목록 조회 (최근 순)
 */
export async function getConsultations(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('consultant_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ 상담 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('❌ 상담 조회 실패:', err);
    return [];
  }
}

/**
 * 오늘 상담 신청 수
 */
export async function getTodayConsultationCount() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split('T')[0];

    const { count, error } = await supabase
      .from('consultant_inquiries')
      .select('*', { count: 'exact' })
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${tomorrow}T00:00:00`);

    if (error) {
      console.error('❌ 오늘 상담 수 조회 오류:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('❌ 오늘 상담 수 조회 실패:', err);
    return 0;
  }
}

/**
 * 총 상담 신청 수
 */
export async function getTotalConsultationCount() {
  try {
    const { count, error } = await supabase
      .from('consultant_inquiries')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('❌ 총 상담 수 조회 오류:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('❌ 총 상담 수 조회 실패:', err);
    return 0;
  }
}

/**
 * 콘텐츠 생성 로그 조회
 */
export async function getContentLogs(limit = 5) {
  try {
    // 콘텐츠 로그 테이블이 있으면 조회, 없으면 더미 데이터 반환
    const { data, error } = await supabase
      .from('content_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      // 테이블이 없을 수 있으니 기본값 반환
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('⚠️ 콘텐츠 로그 조회 (테이블 없음):', err);
    return [];
  }
}

/**
 * 콘텐츠 생성 로그 추가
 */
export async function addContentLog(contentType, title, platform = null) {
  try {
    const { data, error } = await supabase
      .from('content_logs')
      .insert({
        content_type: contentType,
        title,
        platform,
        status: 'published',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.warn('⚠️ 콘텐츠 로그 저장 불가 (테이블 없음):', error);
      return null;
    }

    return data;
  } catch (err) {
    console.warn('⚠️ 콘텐츠 로그 저장 실패:', err);
    return null;
  }
}

/**
 * 실시간 상담 신청 구독
 */
export function subscribeToConsultations(callback) {
  const channel = supabase
    .channel('consultant_inquiries')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'consultant_inquiries' },
      (payload) => {
        console.log('📬 새 상담 신청:', payload.new);
        callback(payload.new);
      }
    )
    .subscribe();

  return () => channel.unsubscribe();
}

/**
 * 보험료 데이터 (Supabase 테이블이 없을 경우 로컬 데이터)
 */
export const insuranceDataLocal = {
  '메리츠': { premium: 25000, change: '+2%', lastUpdated: '2026-03-02' },
  '삼성': { premium: 28000, change: '-0.5%', lastUpdated: '2026-03-02' },
  '현대': { premium: 26000, change: '변화 없음', lastUpdated: '2026-03-02' },
  'DB': { premium: 23000, change: '+1.5%', lastUpdated: '2026-03-02' },
  'KB': { premium: 30000, change: '+3%', lastUpdated: '2026-03-01' },
  '한화': { premium: 32000, change: '+2.5%', lastUpdated: '2026-03-01' },
  '농협': { premium: 26500, change: '+1%', lastUpdated: '2026-03-02' },
  '롯데': { premium: 24000, change: '-1%', lastUpdated: '2026-03-02' }
};

/**
 * 애널리틱스 데이터 (기본값)
 */
export const analyticsDataLocal = {
  totalVisitors: 15234,
  conversionRate: 12.5,
  avgSessionTime: '4m 32s',
  bounceRate: 28.3,
  newUsers: 2341,
  returning: 8234,
  avgClicks: 4.7,
  comparisionChartViews: 68.5,
  consultationRequestRate: 12.5,
  purchaseRate: 8.3,
  blogAvgViews: 2145,
  snsAvgEngagement: 384,
  newsletterOpenRate: 34.2,
  aiRecommendationAccuracy: 94.3,
  aiAnalysisUsage: 6234,
  filterUsageRate: 78.2
};
