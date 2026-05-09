import React, { useEffect, useState, useCallback } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Send,
  XCircle,
  Clock,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { getStats } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getStats();
      setStats(data);
      setLastRefresh(new Date());
    } catch {
      // keep previous data on refresh failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div className="space-y-8">
      <div className="card bg-white/95 border-slate-200/80">
        <div className="grid gap-4 xl:grid-cols-[1.6fr_0.9fr] items-center">
          <div>
            <p className="section-title">Live SMS Gateway</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">Dashboard</h1>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Monitor connected devices, queued messages, and delivery performance from one polished control panel.
            </p>
          </div>
          <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-500">Last refresh</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Loading…'}
              </p>
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Devices"
          value={stats?.totalDevices}
          icon={Smartphone}
          color="blue"
          loading={loading}
        />
        <StatsCard
          title="Active Devices"
          value={stats?.activeDevices}
          subtitle={stats ? `${stats.totalDevices - stats.activeDevices} inactive` : ''}
          icon={CheckCircle2}
          color="green"
          loading={loading}
        />
        <StatsCard
          title="Sent Today"
          value={stats?.sentToday}
          icon={Send}
          color="purple"
          loading={loading}
        />
        <StatsCard
          title="Queued"
          value={stats?.queued}
          icon={Clock}
          color="amber"
          loading={loading}
        />
        <StatsCard
          title="Failed"
          value={stats?.failed}
          icon={XCircle}
          color="red"
          loading={loading}
        />
      </div>

      {/* Device usage table */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-sky-500" />
          <h2 className="text-lg font-semibold text-slate-900">Device Usage</h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !stats?.deviceStats?.length ? (
          <div className="text-center py-10 text-slate-500">
            <Smartphone className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p>No devices configured yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="text-left py-2 pr-4 font-medium">Device</th>
                  <th className="text-left py-2 pr-4 font-medium">Status</th>
                  <th className="text-left py-2 pr-4 font-medium">Today</th>
                  <th className="text-left py-2 pr-4 font-medium">Progress</th>
                  <th className="text-left py-2 font-medium">All Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.deviceStats.map((d) => {
                  const pct =
                    d.dailyLimit > 0
                      ? Math.round((d.usedToday / d.dailyLimit) * 100)
                      : 0;
                  const barColor =
                    pct >= 90
                      ? 'bg-red-500'
                      : pct >= 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500';

                  return (
                    <tr key={d.id} className="border-b border-slate-200/70 last:border-0">
                      <td className="py-3 pr-4 font-medium text-slate-900">{d.name}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={
                            d.status === 'active' ? 'badge-active' : 'badge-inactive'
                          }
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              d.status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'
                            }`}
                          />
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {d.usedToday} / {d.dailyLimit}
                      </td>
                      <td className="py-3 pr-4 min-w-[120px]">
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden w-28">
                          <div
                            className={`h-full rounded-full ${barColor}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-slate-500 text-xs">{pct}%</span>
                      </td>
                      <td className="py-3 text-slate-600">{d.totalSent}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
