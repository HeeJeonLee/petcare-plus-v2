/**
 * PetCare+ Analytics Module
 * Autonomous performance tracking and optimization suggestions
 */

class AnalyticsManager {
  constructor() {
    this.events = [];
    this.sessionData = {
      startTime: Date.now(),
      pageViews: 0,
      clicks: 0,
      scrollDepth: 0,
      timeOnPage: 0,
      userPath: [],
      deviceInfo: this.getDeviceInfo(),
      conversions: 0
    };
    this.batchSize = parseInt(import.meta.env.VITE_ANALYTICS_BATCH_SIZE || '10');
    this.flushInterval = parseInt(import.meta.env.VITE_ANALYTICS_FLUSH_INTERVAL || '30000');
    this.enabled = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
    
    if (this.enabled) {
      this.startAutoFlush();
      this.setupEventListeners();
    }
  }

  trackPageView(pageName, metadata = {}) {
    if (!this.enabled) return;
    this.sessionData.pageViews++;
    this.addEvent('pageView', { page: pageName, timestamp: Date.now(), ...metadata });
  }

  trackClick(element, metadata = {}) {
    if (!this.enabled) return;
    this.sessionData.clicks++;
    this.addEvent('click', {
      element: element?.id || element?.className || 'unknown',
      text: element?.textContent?.substring(0, 50) || '',
      timestamp: Date.now(),
      ...metadata
    });
  }

  trackConversion(conversionType, metadata = {}) {
    if (!this.enabled) return;
    this.sessionData.conversions++;
    this.addEvent('conversion', {
      type: conversionType,
      timestamp: Date.now(),
      sessionDuration: Date.now() - this.sessionData.startTime,
      ...metadata
    });
  }

  trackScrollDepth(depth) {
    if (!this.enabled) return;
    this.sessionData.scrollDepth = Math.max(this.sessionData.scrollDepth, depth);
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      isMobile: /mobile/i.test(navigator.userAgent)
    };
  }

  addEvent(eventType, data) {
    this.events.push({ type: eventType, data, timestamp: Date.now() });
    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('button, a, [role="button"]')) {
        this.trackClick(e.target);
      }
    });

    window.addEventListener('scroll', () => {
      const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      this.trackScrollDepth(scrollDepth);
    });

    setInterval(() => {
      this.sessionData.timeOnPage = Date.now() - this.sessionData.startTime;
    }, 1000);
  }

  startAutoFlush() {
    setInterval(() => {
      if (this.events.length > 0) this.flush();
    }, this.flushInterval);
  }

  async flush() {
    if (this.events.length === 0) return;
    const payload = { sessionData: this.sessionData, events: this.events, timestamp: Date.now() };
    try {
      await fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      this.events = [];
    } catch (error) {
      console.error('Analytics flush failed:', error);
    }
  }

  getSessionSummary() {
    return {
      duration: Date.now() - this.sessionData.startTime,
      pageViews: this.sessionData.pageViews,
      clicks: this.sessionData.clicks,
      scrollDepth: this.sessionData.scrollDepth,
      conversions: this.sessionData.conversions,
      deviceInfo: this.sessionData.deviceInfo
    };
  }
}

const analytics = new AnalyticsManager();
export default analytics;
