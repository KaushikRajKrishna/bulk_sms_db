import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'blue', loading }) {
  const colorMap = {
    blue: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    green: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
    red: 'bg-red-600/20 text-red-400 border-red-500/30',
    purple: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
  };

  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-3xl border ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-sm">{title}</p>
        {loading ? (
          <div className="h-8 w-24 bg-slate-200 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-semibold text-slate-900 mt-0.5">{value ?? '—'}</p>
        )}
        {subtitle && <p className="text-slate-500 text-xs mt-1 truncate">{subtitle}</p>}
      </div>
    </div>
  );
}
