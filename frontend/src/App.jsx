import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import SendSms from './pages/SendSms';
import Logs from './pages/Logs';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-7xl">
        <div className="space-y-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/send" element={<SendSms />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
