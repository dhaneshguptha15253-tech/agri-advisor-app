import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus2, 
  ScanEye, 
  TrendingUp, 
  MapPin, 
  UserCircle2, 
  Sparkles,
  CloudSun,
  Activity
} from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Generate Advisory', path: '/advisory/new', icon: FilePlus2 },
    { name: 'Visual Disease Inspector', path: '/inspector', icon: ScanEye },
    { name: 'Market Price Insights', path: '/market', icon: TrendingUp },
    { name: 'Farmer Profile & Fields', path: '/profile', icon: UserCircle2 },
  ];

  return (
    <aside className="w-64 hidden lg:flex flex-col flex-shrink-0 bg-slate-950/60 border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        
        {/* Navigation Group */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Agronomic Modules
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Real-time Field Weather / AI Diagnostic Mini Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-amber-400" /> Microclimate
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
              Live
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
              <p className="text-[10px] text-slate-400">Soil Moisture</p>
              <p className="text-sm font-bold text-emerald-400">42% Optimal</p>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
              <p className="text-[10px] text-slate-400">Temp / RH</p>
              <p className="text-sm font-bold text-sky-400">24°C / 65%</p>
            </div>
          </div>

          <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" /> Soil pH Band
            </span>
            <span className="font-semibold text-slate-200">6.4 - 6.8</span>
          </div>
        </div>

      </div>

      {/* AI Engine Status Footnote */}
      <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-slate-300 truncate">Gemini 2.5 Flash</p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Multimodal Online
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
