"use client";

import { useState, useEffect } from "react";
import { getTodayStats, getUsagePercentage, getApiLogs } from "@/lib/analytics";

interface Stats {
  date: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
}

interface Usage {
  daily: number;
  minutely: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    const updateStats = () => {
      setStats(getTodayStats());
      setUsage(getUsagePercentage());
      setRecentLogs(getApiLogs().slice(-20).reverse());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats || !usage) {
    return <div className="p-8">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          📊 管理ダッシュボード
        </h1>

        {/* 無料枠使用状況 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Gemini API 日次使用量
            </h2>
            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>{stats.totalRequests} / 1,500 リクエスト</span>
              <span>{usage.daily.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  usage.daily > 80 ? "bg-red-500" : usage.daily > 50 ? "bg-yellow-500" : "bg-green-500"
                }`}
                style={{ width: `${Math.min(usage.daily, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              無料枠: 1,500リクエスト/日
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Gemini API 分次使用量
            </h2>
            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>直近1分間</span>
              <span>{usage.minutely.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  usage.minutely > 80 ? "bg-red-500" : usage.minutely > 50 ? "bg-yellow-500" : "bg-green-500"
                }`}
                style={{ width: `${Math.min(usage.minutely, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              無料枠: 60リクエスト/分
            </p>
          </div>
        </div>

        {/* 今日の統計 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalRequests}
            </div>
            <div className="text-sm text-gray-500 mt-1">総リクエスト</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.successfulRequests}
            </div>
            <div className="text-sm text-gray-500 mt-1">成功</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {stats.failedRequests}
            </div>
            <div className="text-sm text-gray-500 mt-1">失敗</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.averageResponseTime}ms
            </div>
            <div className="text-sm text-gray-500 mt-1">平均応答時間</div>
          </div>
        </div>

        {/* 最近のログ */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            最近のAPIリクエスト
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">時刻</th>
                  <th className="text-left py-2 px-4">エンドポイント</th>
                  <th className="text-left py-2 px-4">ステータス</th>
                  <th className="text-left py-2 px-4">応答時間</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-400">
                      まだログがありません
                    </td>
                  </tr>
                ) : (
                  recentLogs.map((log, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-gray-600">
                        {new Date(log.timestamp).toLocaleTimeString("ja-JP")}
                      </td>
                      <td className="py-2 px-4 font-mono text-xs">
                        {log.endpoint}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            log.success
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {log.success ? "成功" : "失敗"}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-gray-600">
                        {log.responseTime}ms
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 収益目安 */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">💰 収益シミュレーション</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">
                ¥{Math.round(stats.totalRequests * 0.3)}
              </div>
              <div className="text-sm opacity-80">本日の推定収益</div>
              <div className="text-xs opacity-60">（0.3円/PV想定）</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                ¥{Math.round(stats.totalRequests * 0.3 * 30)}
              </div>
              <div className="text-sm opacity-80">月間推定収益</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                ¥{Math.round(stats.totalRequests * 0.3 * 365)}
              </div>
              <div className="text-sm opacity-80">年間推定収益</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
