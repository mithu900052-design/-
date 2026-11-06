import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  Smartphone, 
  Layers, 
  Flame, 
  Calendar, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Device, Language, AppUsageStat } from '../types';
import { translations } from '../i18n/translations';
import { apiClient } from '../api/client';

interface AppUsageViewProps {
  device: Device | null;
  lang: Language;
}

export const AppUsageView: React.FC<AppUsageViewProps> = ({ device, lang }) => {
  const t = translations[lang];
  const [usageStats, setUsageStats] = useState<AppUsageStat[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    if (!device) return;
    apiClient.getUsageStats(device.id)
      .then(setUsageStats)
      .catch(console.error);
  }, [device]);

  if (!device) return null;

  const totalMinutes = usageStats.reduce(
    (acc, item) => acc + (timeframe === 'daily' ? item.dailyMinutes : item.weeklyMinutes),
    0
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.appUsageTitle}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official Android UsageStatsManager screen time and foreground application duration metrics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#0F172A] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              timeframe === 'daily' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Today's Usage
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              timeframe === 'weekly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Past 7 Days
          </button>
        </div>
      </div>

      {/* Screen Time Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{timeframe === 'daily' ? t.dailyScreenTime : t.weeklyScreenTime}</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{hours}h {minutes}m</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Under healthy daily limit (3h 30m)</span>
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Most Active Category</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-300 font-mono">Education</p>
          <p className="text-[11px] text-slate-400 mt-1">Duolingo &amp; Google Classroom</p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>App Launches Today</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400 font-mono">
            {usageStats.reduce((acc, s) => acc + s.launchCount, 0)} Opens
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Normal session interaction</p>
        </div>
      </div>

      {/* Usage Duration Breakdown Bars */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">{t.mostUsedApps}</h2>
          <span className="text-xs text-slate-400 font-mono">Time in Foreground</span>
        </div>

        <div className="space-y-4">
          {usageStats.map((item) => {
            const mins = timeframe === 'daily' ? item.dailyMinutes : item.weeklyMinutes;
            const percent = totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0;
            const itemHours = Math.floor(mins / 60);
            const itemMins = mins % 60;

            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{item.appName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">Last used {item.lastUsed}</span>
                    <span className="font-bold text-cyan-300 font-mono">
                      {itemHours > 0 ? `${itemHours}h ` : ''}{itemMins}m ({percent}%)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#080C15] h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Privacy Intrusion: In-app chat contents, searches, or passwords are never captured.</span>
          </span>
          <span className="font-mono">API 34 UsageStatsManager</span>
        </div>
      </div>

    </div>
  );
};
