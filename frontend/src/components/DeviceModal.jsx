import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';

const EMPTY = {
  name: '',
  gatewayUrl: '',
  username: '',
  password: '',
  dailyLimit: 100,
  status: 'active',
};

export default function DeviceModal({ open, device, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(device ? { ...EMPTY, ...device } : EMPTY);
      setErrors({});
      setShowPass(false);
    }
  }, [open, device]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.gatewayUrl.trim()) e.gatewayUrl = 'Gateway URL is required';
    else if (!/^https?:\/\/.+/.test(form.gatewayUrl.trim()))
      e.gatewayUrl = 'Must be a valid URL starting with http:// or https://';
    if (!form.dailyLimit || form.dailyLimit < 1) e.dailyLimit = 'Must be at least 1';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  function field(key, value = form[key]) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl shadow-slate-300/20">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {device ? 'Edit Device' : 'Add New Device'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="label">Device Name *</label>
            <input
              className="input"
              placeholder="e.g. Samsung Galaxy S21"
              value={form.name}
              onChange={field('name')}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Gateway URL */}
          <div>
            <label className="label">Gateway URL *</label>
            <input
              className="input"
              placeholder="https://abc123.ngrok.io"
              value={form.gatewayUrl}
              onChange={field('gatewayUrl')}
            />
            {errors.gatewayUrl && (
              <p className="text-red-400 text-xs mt-1">{errors.gatewayUrl}</p>
            )}
          </div>

          {/* Auth row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Username</label>
              <input
                className="input"
                placeholder="optional"
                value={form.username}
                onChange={field('username')}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="optional"
                  value={form.password}
                  onChange={field('password')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Limit + status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Daily Limit *</label>
              <input
                type="number"
                className="input"
                min="1"
                max="10000"
                value={form.dailyLimit}
                onChange={(e) => setForm((f) => ({ ...f, dailyLimit: parseInt(e.target.value) || 1 }))}
              />
              {errors.dailyLimit && (
                <p className="text-red-400 text-xs mt-1">{errors.dailyLimit}</p>
              )}
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={field('status')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving…' : device ? 'Update Device' : 'Add Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
