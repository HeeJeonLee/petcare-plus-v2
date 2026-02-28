/**
 * PetCare+ Insurance Data Manager
 * 자률진화형 플랫폼 - 보험 데이터 자동 갱신 시스템
 */

class InsuranceDataManager {
  constructor() {
    this.dataSource = import.meta.env.VITE_INSURANCE_DATA_SOURCE || 'internal';
    this.autoUpdateEnabled = import.meta.env.VITE_AUTO_INSURANCE_UPDATE_ENABLED === 'true';
    this.lastUpdateTime = null;
    this.insuranceData = null;
    this.updateHistory = [];
  }

  /**
   * DB에서 보험 데이터 로드
   */
  async loadInsuranceData() {
    try {
      const response = await fetch('/api/insurance-data');
      if (!response.ok) throw new Error('Failed to load insurance data');

      this.insuranceData = await response.json();
      this.lastUpdateTime = new Date();
      console.log('✅ Insurance data loaded from database');
      return this.insuranceData;
    } catch (error) {
      console.error('❌ Failed to load insurance data:', error);
      return this.getDefaultData();
    }
  }

  /**
   * 기본 보험 데이터 반환 (DB 없을 때 fallback)
   */
  getDefaultData() {
    return [
      {
        id: 'meritz',
        name: '메리츠화재',
        product: '펫퍼민트',
        marketShare: '1위',
        monthlyPremium: { '1세': 22000, '3세': 25000, '5세': 30000, '7세 이상': 38000 },
        coverage: { medical: 5000000, surgery: 10000000, liability: 100000000, mriCt: 3000000 },
        specialFeatures: ['슬개골 보장 (1년 면책)', '전국 2,000개 제휴병원', '자동 청구 시스템', '갱신 15세까지'],
        rating: 5,
        lastUpdated: new Date().toISOString(),
        updateFrequency: 'weekly'
      },
      // ... 나머지 7개사 데이터 (InsuranceComparison.jsx에서 가져옴)
    ];
  }

  /**
   * 보험료 변경 감지
   */
  detectPremiumChanges(newData) {
    if (!this.insuranceData) return [];

    const changes = [];
    newData.forEach(newCompany => {
      const oldCompany = this.insuranceData.find(c => c.id === newCompany.id);
      if (oldCompany) {
        // 보험료 비교
        Object.keys(newCompany.monthlyPremium).forEach(age => {
          if (oldCompany.monthlyPremium[age] !== newCompany.monthlyPremium[age]) {
            changes.push({
              companyId: newCompany.id,
              companyName: newCompany.name,
              changeType: 'premium',
              age,
              oldValue: oldCompany.monthlyPremium[age],
              newValue: newCompany.monthlyPremium[age],
              percentChange: ((newCompany.monthlyPremium[age] - oldCompany.monthlyPremium[age]) / oldCompany.monthlyPremium[age] * 100).toFixed(2),
              timestamp: new Date().toISOString()
            });
          }
        });

        // 특약 변경 감지
        if (JSON.stringify(oldCompany.specialFeatures) !== JSON.stringify(newCompany.specialFeatures)) {
          changes.push({
            companyId: newCompany.id,
            companyName: newCompany.name,
            changeType: 'features',
            oldFeatures: oldCompany.specialFeatures,
            newFeatures: newCompany.specialFeatures,
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    return changes;
  }

  /**
   * 보험 데이터 업데이트
   */
  async updateInsuranceData(newData) {
    try {
      // 변경사항 감지
      const changes = this.detectPremiumChanges(newData);

      // 변경사항이 있으면 기록
      if (changes.length > 0) {
        this.updateHistory.push({
          timestamp: new Date().toISOString(),
          changes,
          status: 'pending', // 관리자 승인 대기
          autoApplied: import.meta.env.VITE_AUTO_APPLY_UPDATES === 'true'
        });

        console.log(`🔄 Detected ${changes.length} changes in insurance data`);

        // 변경사항을 서버에 저장
        await this.saveUpdateHistory(changes);

        // 자동 생성 콘텐츠 요청
        await this.generateContentForChanges(changes);

        return { success: true, changes, requiresApproval: true };
      }

      return { success: true, changes: [], message: 'No changes detected' };
    } catch (error) {
      console.error('❌ Error updating insurance data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 업데이트 이력 저장
   */
  async saveUpdateHistory(changes) {
    try {
      await fetch('/api/insurance-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          changes,
          timestamp: new Date().toISOString(),
          source: this.dataSource
        })
      });
      console.log('✅ Update history saved');
    } catch (error) {
      console.error('❌ Failed to save update history:', error);
    }
  }

  /**
   * 변경사항에 대한 자동 콘텐츠 생성
   */
  async generateContentForChanges(changes) {
    try {
      const premiumChanges = changes.filter(c => c.changeType === 'premium');
      if (premiumChanges.length === 0) return;

      // 각 변경사항에 대해 블로그 포스트 제안
      const contentPrompts = premiumChanges.map(change => ({
        type: 'blog',
        title: `${change.companyName} 보험료 ${change.percentChange > 0 ? '인상' : '인하'} (${change.age} 기준)`,
        description: `${change.companyName}의 보험료가 변경되었습니다. 기존 ${change.oldValue.toLocaleString()}원에서 ${change.newValue.toLocaleString()}원으로 ${change.percentChange}% 변경되었습니다.`,
        change
      }));

      // 관리자에게 알림
      await this.notifyAdminOfChanges(premiumChanges);
    } catch (error) {
      console.error('❌ Error generating content for changes:', error);
    }
  }

  /**
   * 관리자에게 변경사항 알림
   */
  async notifyAdminOfChanges(changes) {
    try {
      const summaryText = changes
        .map(c => `${c.companyName}: ${c.age} 연령 보험료 ${c.percentChange}% 변경`)
        .join('\n');

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'System',
          email: import.meta.env.VITE_CONSULTANT_EMAIL || 'admin@petcare-plus.com',
          subject: `🔔 PetCare+ 보험료 변경 감지 (${changes.length}건)`,
          message: `다음 보험료 변경사항이 감지되었습니다:\n\n${summaryText}\n\n확인 후 승인해주세요.`,
          isSystemNotification: true
        })
      });
      console.log('📧 Admin notification sent');
    } catch (error) {
      console.error('❌ Error sending admin notification:', error);
    }
  }

  /**
   * 스케줄 시작 (자동 데이터 갱신)
   */
  scheduleAutoUpdate() {
    if (!this.autoUpdateEnabled) return;

    const interval = parseInt(import.meta.env.VITE_AUTO_UPDATE_INTERVAL || '1440') * 60 * 1000;
    setInterval(() => {
      console.log('🔄 Running scheduled insurance data update...');
      this.loadInsuranceData();
    }, interval);

    console.log('📅 Insurance data auto-update scheduled');
  }

  /**
   * 통계 조회
   */
  getStats() {
    return {
      lastUpdateTime: this.lastUpdateTime,
      totalChanges: this.updateHistory.reduce((sum, h) => sum + h.changes.length, 0),
      updateHistory: this.updateHistory,
      dataSource: this.dataSource,
      autoUpdateEnabled: this.autoUpdateEnabled
    };
  }
}

const insuranceDataManager = new InsuranceDataManager();
export default insuranceDataManager;
