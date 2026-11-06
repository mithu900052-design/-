import React from 'react';
import { 
  Smartphone, 
  MapPin, 
  Battery, 
  ScreenShare, 
  Activity, 
  Users, 
  Wifi, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  Clock, 
  Radio, 
  Plus, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Device, Language, DeviceActivityLog, AdminUser, SubscriptionPlan } from '../types';
import { translations } from '../i18n/translations';

interface OverviewViewProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
  activities: DeviceActivityLog[];
  adminUser: AdminUser | null;
  subscription: SubscriptionPlan | null;
  lang: Language;
  onNavigateTab: (tab: string) => void;
  onOpenPairing: () => void;
  onOpenSimulator: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  devices,
  selectedDevice,
  onSelectDevice,
  activities,
  adminUser,
  subscription,
  lang,
  onNavigateTab,
  onOpenPairing,
  onOpenSimulator
}) => {
  const t = translations[lang];

  const totalCount = devices.length;
  const connectedCount = devices.filter(d => d.status === 'online').length;
  const disconnectedCount = totalCount - connectedCount;
  const avgBattery = totalCount > 0 
    ? Math.round(devices.reduce((acc, d) => acc + d.battery.level, 0) / totalCount) 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-[#0F172A] to-slate-900 border border-blue-500/30 p-6 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                ACTIVE PROTECTION
              </span>
              <span className="text-xs text-slate-400">• Subscription: {subscription?.name || 'Premium Shield'}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-2 tracking-tight">
              {lang === 'en' ? 'Family Safety & Device Command Center' : 'পারিবারিক সুরক্ষা এবং ডিভাইস কমান্ড সেন্টার'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Real-time parental guidance with GPS geofencing, battery telemetry, screen sharing authorization, and installed app monitoring in full compliance with Android privacy guidelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/25"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{t.deviceSimulator}</span>
            </button>
            <button
              onClick={onOpenPairing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t.pairNewDevice}</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Devices */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">{t.totalDevices}</p>
            <p className="text-2xl font-bold text-white font-mono mt-1">{totalCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Limit: {subscription?.maxDevices || 5} devices</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>

        {/* Connected Now */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">{t.connectedDevices}</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{connectedCount}</p>
            <p className="text-[10px] text-emerald-500/80 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Transmitting live
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Wifi className="w-5 h-5" />
          </div>
        </div>

        {/* Average Battery */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">{t.batteryStatus}</p>
            <p className="text-2xl font-bold text-cyan-300 font-mono mt-1">{avgBattery}%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Optimal health</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Battery className="w-5 h-5" />
          </div>
        </div>

        {/* Active Guardians */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">{t.activeUsers}</p>
            <p className="text-2xl font-bold text-indigo-300 font-mono mt-1">2</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Family Guard Team</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Selected Device Quick Telemetry + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monitored Device Focus Card */}
        {selectedDevice && (
          <div className="lg:col-span-2 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{selectedDevice.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {selectedDevice.status.toUpperCase()}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedDevice.model} • {selectedDevice.assignedFamilyMember}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('device-info')}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <span>View Full Device Info</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Battery */}
              <div className="bg-[#080C15] p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Battery</span>
                </div>
                <p className="text-base font-bold text-white font-mono">{selectedDevice.battery.level}%</p>
                <p className="text-[10px] text-slate-500">
                  {selectedDevice.battery.isCharging ? '⚡ Fast Charging' : 'On Battery'}
                </p>
              </div>

              {/* Wi-Fi / SSID */}
              <div className="bg-[#080C15] p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Wifi className="w-3.5 h-3.5 text-blue-400" />
                  <span>Network</span>
                </div>
                <p className="text-xs font-bold text-cyan-300 truncate">{selectedDevice.network.ssid}</p>
                <p className="text-[10px] text-slate-500 font-mono">{selectedDevice.network.linkSpeedMbps} Mbps</p>
              </div>

              {/* Installed Apps */}
              <div className="bg-[#080C15] p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Installed Apps</span>
                </div>
                <p className="text-base font-bold text-white font-mono">{selectedDevice.installedApps?.length || 0}</p>
                <p className="text-[10px] text-emerald-400">Consent Granted</p>
              </div>

              {/* Free Space */}
              <div className="bg-[#080C15] p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Free Space</span>
                </div>
                <p className="text-base font-bold text-white font-mono">
                  {(selectedDevice.storage.availableBytes / (1024 * 1024 * 1024)).toFixed(0)} GB
                </p>
                <p className="text-[10px] text-slate-500">Available</p>
              </div>
            </div>

            {/* Live Location Card with Address */}
            <div className="p-4 rounded-xl bg-[#080C15] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Current GPS Coordinates</p>
                  <p className="text-xs text-cyan-300 font-medium mt-0.5">{selectedDevice.liveLocation.address}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {selectedDevice.liveLocation.latitude.toFixed(4)}, {selectedDevice.liveLocation.longitude.toFixed(4)} • Speed: {selectedDevice.liveLocation.speed} km/h • Accuracy: ±{selectedDevice.liveLocation.accuracy}m
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('live-location')}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-400 text-xs font-bold border border-blue-500/40 transition shrink-0 self-start sm:self-auto"
              >
                Open Live Map
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                onClick={() => onNavigateTab('live-location')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-left transition"
              >
                <MapPin className="w-4 h-4 text-cyan-400 mb-1" />
                <p className="text-xs font-semibold text-white">Live Tracking</p>
                <p className="text-[10px] text-slate-500">Watch route real-time</p>
              </button>

              <button
                onClick={() => onNavigateTab('screen-sharing')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-left transition"
              >
                <ScreenShare className="w-4 h-4 text-blue-400 mb-1" />
                <p className="text-xs font-semibold text-white">Screen Mirror</p>
                <p className="text-[10px] text-slate-500">View live screen stream</p>
              </button>

              <button
                onClick={() => onNavigateTab('device-info')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-left transition"
              >
                <Layers className="w-4 h-4 text-purple-400 mb-1" />
                <p className="text-xs font-semibold text-white">Installed Apps</p>
                <p className="text-[10px] text-slate-500">Query package list</p>
              </button>
            </div>

          </div>
        )}

        {/* Right Col: Recent Device Activity Feed */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>{t.recentActivity}</span>
            </div>
            <button
              onClick={() => onNavigateTab('device-activity')}
              className="text-[11px] text-cyan-400 hover:underline"
            >
              See All
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-slate-800">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No recent activity events recorded.</p>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-[#080C15] border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-white leading-tight">{act.title}</p>
                    <span className="text-[9px] font-mono text-slate-500 shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{act.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
