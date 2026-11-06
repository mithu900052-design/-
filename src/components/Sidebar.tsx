import React from 'react';
import { 
  LayoutDashboard, 
  Smartphone, 
  Info, 
  MapPin, 
  History, 
  ScreenShare, 
  BarChart3, 
  BatteryMedium, 
  Activity, 
  Bell, 
  Users, 
  Settings, 
  ShieldCheck, 
  CreditCard,
  Code2,
  Globe,
  Radio
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  unreadNotifsCount: number;
  onOpenSimulator: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  unreadNotifsCount,
  onOpenSimulator
}) => {
  const t = translations[lang];

  const menuItems = [
    { id: 'overview', label: t.navOverview, icon: LayoutDashboard },
    { id: 'my-devices', label: t.navMyDevices, icon: Smartphone },
    { id: 'device-info', label: t.navDeviceInfo, icon: Info, highlight: true },
    { id: 'live-location', label: t.navLiveLocation, icon: MapPin },
    { id: 'location-history', label: t.navLocationHistory, icon: History },
    { id: 'screen-sharing', label: t.navScreenSharing, icon: ScreenShare },
    { id: 'app-usage', label: t.navAppUsage, icon: BarChart3 },
    { id: 'battery-info', label: t.navBatteryInfo, icon: BatteryMedium },
    { id: 'device-activity', label: t.navDeviceActivity, icon: Activity },
    { id: 'notifications', label: t.navNotifications, icon: Bell, badge: unreadNotifsCount },
    { id: 'user-management', label: t.navUserManagement, icon: Users },
    { id: 'account-settings', label: t.navAccountSettings, icon: Settings },
    { id: 'security-settings', label: t.navSecuritySettings, icon: ShieldCheck },
    { id: 'subscription', label: t.navSubscription, icon: CreditCard },
    { id: 'android-code', label: t.navAndroidStudioProject, icon: Code2, accent: true },
  ];

  return (
    <aside className="w-72 bg-[#0A0E1A] border-r border-slate-800/80 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#080C15] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-white font-mono">F SPY</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">PRO</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Family Safety Platform</p>
          </div>
        </div>

        {/* Language switch button */}
        <button
          onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-slate-700 transition"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="font-semibold">{lang === 'en' ? 'বাংলা' : 'EN'}</span>
        </button>
      </div>

      {/* Companion Phone Simulator Banner / Quick Trigger */}
      <div className="px-3 pt-3">
        <button
          onClick={onOpenSimulator}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-cyan-900/40 border border-blue-500/30 hover:border-cyan-400/50 text-left transition group shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition">Android Simulator</p>
              <p className="text-[10px] text-slate-400">Test live telemetry & consent</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
        <p className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 px-3 py-1.5">
          {lang === 'en' ? 'Navigation' : 'মেনু'}
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
              {item.accent && !isActive && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  Kotlin
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080C15]/60 text-[11px] text-slate-400">
        <div className="flex items-center justify-between text-slate-400">
          <span>Target Android:</span>
          <span className="text-slate-200 font-mono">API 34 / SDK 35</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 mt-1">
          <span>Protocol:</span>
          <span className="text-emerald-400 font-mono">E2EE HTTPS/WSS</span>
        </div>
      </div>
    </aside>
  );
};
