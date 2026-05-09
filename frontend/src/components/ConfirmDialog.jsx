import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl shadow-slate-300/20">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-rose-500' : 'text-amber-500'}`} />
            <h2 className="font-semibold text-slate-900">{title}</h2>
          </div>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-slate-600 text-sm">{message}</p>
        </div>
        <div className="flex justify-end gap-3 px-5 pb-5">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className={danger ? 'btn-danger' : 'btn-primary'}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
