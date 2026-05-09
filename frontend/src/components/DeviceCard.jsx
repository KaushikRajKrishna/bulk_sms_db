import React, { useState } from 'react';
import { Pencil, Trash2, Wifi, WifiOff, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { testConnection } from '../services/api';
import toast from 'react-hot-toast';

export default function DeviceCard({ device, onEdit, onDelete }) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const pct = device.dailyLimit > 0 ? Math.round((device.usedToday / device.dailyLimit) * 100) : 0;
  const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testConnection(device._id || device.id);
      setTestResult(result);
      if (result.success) {
        toast.success(`Connected to ${device.name} (${result.latency}ms)`);
      } else {
        toast.error(`Connection failed: ${result.message}`);
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message });
      toast.error(err.message);
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="card flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              device.status === 'active' ? 'bg-emerald-100' : 'bg-slate-100'
            }`}
          >
            {device.status === 'active' ? (
              <Wifi className="w-5 h-5 text-emerald-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{device.name}</h3>
            <p className="text-xs text-slate-500 truncate max-w-[180px]" title={device.gatewayUrl}>
              {device.gatewayUrl}
            </p>
          </div>
        </div>
        <span className={device.status === 'active' ? 'badge-active' : 'badge-inactive'}>
          <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
          {device.status}
        </span>
      </div>

      {/* Usage bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Today's usage</span>
          <span>
            {device.usedToday} / {device.dailyLimit}
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">{device.dailyLimit - device.usedToday} remaining · {device.totalSent ?? 0} total sent</p>
      </div>

      {/* Test result */}
      {testResult && (
        <div
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
            testResult.success
              ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/40'
              : 'bg-red-900/30 text-red-400 border border-red-700/40'
          }`}
        >
          {testResult.success ? (
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <XCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          <span className="truncate">{testResult.message}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleTest}
          disabled={testing}
          className="flex-1 flex items-center justify-center gap-1.5 btn-secondary text-sm py-1.5"
        >
          {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
          {testing ? 'Testing…' : 'Test'}
        </button>
        <button onClick={() => onEdit(device)} className="btn-secondary px-3 py-1.5">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(device)} className="btn-danger px-3 py-1.5">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
