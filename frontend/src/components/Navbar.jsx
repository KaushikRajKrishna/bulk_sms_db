import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Smartphone, Send, ScrollText, Zap } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/devices', label: 'Devices', icon: Smartphone },
  { to: '/send', label: 'Send SMS', icon: Send },
  { to: '/logs', label: 'Logs', icon: ScrollText },
];

export default function Navbar() {
  return (
    <nav className="bg-white/90 border-b border-slate-200 sticky top-0 z-50 backdrop-blur-xl shadow-sm shadow-slate-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500/15 p-3 rounded-2xl shadow-sm shadow-sky-500/10">
              <Zap className="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <span className="text-slate-900 font-bold text-lg tracking-tight block">SMS Gateway</span>
              <span className="text-slate-500 text-xs">Modern messaging management for your devices</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-700 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
