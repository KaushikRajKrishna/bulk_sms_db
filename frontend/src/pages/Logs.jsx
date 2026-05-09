import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Search, ChevronLeft, ChevronRight, ScrollText } from 'lucide-react';
import toast from 'react-hot-toast';
import { getLogs } from '../services/api';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'sent', label: 'Sent' },
  { value: 'queued', label: 'Queued' },
  { value: 'failed', label: 'Failed' },
];

function StatusBadge({ status }) {
  if (status === 'sent') return <span className="badge-sent">Sent</span>;
  if (status === 'failed') return <span className="badge-failed">Failed</span>;
  return <span className="badge-queued">Queued</span>;
}

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLogs({ page, limit, status: statusFilter, search });
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [statusFilter, search]);

  function formatDate(ts) {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="space-y-5">
      <div className="card bg-white/90 border-slate-200/80">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-title">Activity log</p>
            <h1 className="text-3xl font-semibold text-slate-900">SMS Logs</h1>
            <p className="text-slate-600 text-sm mt-2">{pagination.total} total records across all devices.</p>
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

      {/* Filters */}
      <div className="card bg-white/95 border-slate-200/80 p-4 gap-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            className="input pl-9"
            placeholder="Search number, message, device…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                statusFilter === value
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
              <tr className="text-slate-300">
                <th className="text-left px-4 py-3 font-medium">Number</th>
                <th className="text-left px-4 py-3 font-medium">Message</th>
                <th className="text-left px-4 py-3 font-medium">Device</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-200/70">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-500">
                    <ScrollText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    No logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="border-b border-slate-200/70 last:border-0 hover:bg-slate-100 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-slate-900">{log.number}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px]">
                      <p className="truncate" title={log.message}>
                        {log.message}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {log.deviceName || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={log.status} />
                      {log.errorMessage && (
                        <p className="text-red-400 text-xs mt-0.5 max-w-[160px] truncate" title={log.errorMessage}>
                          {log.errorMessage}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <span className="text-xs text-slate-500">
              Page {page} of {pagination.pages} · {pagination.total} records
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-2 py-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {/* Page number pills */}
              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                const p = Math.max(1, Math.min(page - 2, pagination.pages - 4)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      p === page
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="btn-secondary px-2 py-1.5"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
