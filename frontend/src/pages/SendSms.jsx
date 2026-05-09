import React, { useState, useRef } from 'react';
import { Send, Upload, X, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import { sendSms } from '../services/api';

export default function SendSms() {
  const [message, setMessage] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  function addManualNumbers() {
    const raw = manualInput
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter(Boolean);

    if (!raw.length) return;
    setNumbers((prev) => [...new Set([...prev, ...raw])]);
    setManualInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addManualNumbers();
    }
  }

  function removeNumber(n) {
    setNumbers((prev) => prev.filter((x) => x !== n));
  }

  function handleCsvUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete(results) {
        const flat = results.data.flat().map((v) => String(v).trim()).filter(Boolean);
        const unique = [...new Set(flat)];
        setNumbers((prev) => [...new Set([...prev, ...unique])]);
        toast.success(`Imported ${unique.length} number(s) from CSV`);
      },
      error(err) {
        toast.error(`CSV parse error: ${err.message}`);
      },
      skipEmptyLines: true,
    });
    e.target.value = '';
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!message.trim()) return toast.error('Please enter a message');
    if (!numbers.length) return toast.error('Please add at least one phone number');

    setSending(true);
    setResult(null);
    try {
      const data = await sendSms({ message: message.trim(), numbers });
      setResult({ success: true, ...data });
      toast.success(`${data.queued} message(s) queued!`);
      setNumbers([]);
      setMessage('');
    } catch (err) {
      setResult({ success: false, message: err.message });
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  }

  const remaining = 160 - message.length;
  const multiSms = Math.ceil(message.length / 160);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card bg-white/90 border-slate-200/80">
        <p className="section-title mb-2">SMS Composer</p>
        <h1 className="text-3xl font-semibold text-slate-900">Send SMS</h1>
        <p className="text-slate-600 text-sm mt-2">
          Create broadcast messages, import recipients, and queue campaigns with confidence.
        </p>
      </div>

      <form onSubmit={handleSend} className="space-y-5">
        {/* Message */}
        <div className="card">
          <label className="label">
            Message *
          </label>
          <textarea
            className="input min-h-[120px] resize-y shadow-sm"
            placeholder="Type your SMS message here…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={918}
          />
          <div className="flex justify-between mt-1.5 text-xs text-slate-500">
            <span>{message.length} characters</span>
            <span>
              {multiSms > 1
                ? `${multiSms} SMS parts`
                : remaining >= 0
                ? `${remaining} chars remaining`
                : ''}
            </span>
          </div>
        </div>

        {/* Phone numbers */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <label className="label mb-0">
              Phone Numbers *
            </label>
            <span className="text-xs text-slate-500">{numbers.length} added</span>
          </div>

          {/* Manual input */}
          <div className="flex gap-2">
            <textarea
              className="input flex-1 h-16 resize-none"
              placeholder="Enter numbers (one per line, or comma-separated)"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={addManualNumbers}
              className="btn-secondary px-3 self-stretch"
              title="Add numbers"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* CSV upload */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleCsvUpload}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              Import from CSV
            </button>
          </div>

          {/* Numbers list */}
          {numbers.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-1">
              {numbers.map((n) => (
                <div
                  key={n}
                  className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-2xl px-3 py-1.5 text-sm"
                >
                  <span className="text-gray-200">{n}</span>
                  <button
                    type="button"
                    onClick={() => removeNumber(n)}
                    className="text-slate-500 hover:text-rose-500 transition-colors ml-2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {numbers.length > 0 && (
            <button
              type="button"
              onClick={() => setNumbers([])}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all numbers
            </button>
          )}
        </div>

        {/* Result banner */}
        {result && (
          <div
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
              result.success
                ? 'bg-emerald-900/30 border-emerald-700/40 text-emerald-300'
                : 'bg-red-900/30 border-red-700/40 text-red-300'
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">{result.success ? 'Messages Queued' : 'Send Failed'}</p>
              <p className="opacity-80 text-xs mt-0.5">
                {result.success ? result.message : result.message}
              </p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={sending || !message.trim() || !numbers.length}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
        >
          {sending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {sending ? 'Queuing messages…' : `Send to ${numbers.length || 0} number${numbers.length !== 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  );
}
