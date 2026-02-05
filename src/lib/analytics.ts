// API使用量トラッキング
// Gemini API無料枠: 60回/分、1500回/日

interface UsageLog {
  timestamp: string;
  endpoint: string;
  success: boolean;
  responseTime: number;
}

interface DailyStats {
  date: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
}

// ブラウザのlocalStorageを使った簡易的なログ保存
// 本番環境ではデータベースに置き換え推奨

export function logApiCall(endpoint: string, success: boolean, responseTime: number): void {
  if (typeof window === 'undefined') return;

  const log: UsageLog = {
    timestamp: new Date().toISOString(),
    endpoint,
    success,
    responseTime,
  };

  const logs = getApiLogs();
  logs.push(log);

  // 直近1000件のみ保持
  if (logs.length > 1000) {
    logs.shift();
  }

  localStorage.setItem('api_logs', JSON.stringify(logs));
}

export function getApiLogs(): UsageLog[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('api_logs');
  return stored ? JSON.parse(stored) : [];
}

export function getTodayStats(): DailyStats {
  const logs = getApiLogs();
  const today = new Date().toISOString().split('T')[0];

  const todayLogs = logs.filter(log => log.timestamp.startsWith(today));

  const successful = todayLogs.filter(log => log.success);
  const avgTime = todayLogs.length > 0
    ? todayLogs.reduce((sum, log) => sum + log.responseTime, 0) / todayLogs.length
    : 0;

  return {
    date: today,
    totalRequests: todayLogs.length,
    successfulRequests: successful.length,
    failedRequests: todayLogs.length - successful.length,
    averageResponseTime: Math.round(avgTime),
  };
}

export function getUsagePercentage(): { daily: number; minutely: number } {
  const logs = getApiLogs();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const oneMinuteAgo = new Date(now.getTime() - 60000).toISOString();

  const todayLogs = logs.filter(log => log.timestamp.startsWith(today));
  const lastMinuteLogs = logs.filter(log => log.timestamp > oneMinuteAgo);

  return {
    daily: (todayLogs.length / 1500) * 100,  // Gemini無料枠: 1500回/日
    minutely: (lastMinuteLogs.length / 60) * 100,  // Gemini無料枠: 60回/分
  };
}

// Google Analytics イベント送信
export function trackEvent(eventName: string, params?: Record<string, string | number>): void {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
}

// ページビュートラッキング
export function trackPageView(pagePath: string): void {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: pagePath,
    });
  }
}
