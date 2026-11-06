import React from 'react';
import { 
  Smartphone, 
  Battery, 
  Wifi, 
  RefreshCw, 
  Plus, 
  Bell, 
  ChevronDown, 
  Globe, 
  CheckCircle2,
  Shield,
  Radio
} from 'lucide-react';
import { Device, Language, AdminUser, NotificationItem } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  adminUser: AdminUser | null;
  notifications: NotificationItem[];
  onOpenPairing: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  devices,
  selectedDevice,
  onSelectDevice,
  lang,
  setLang,
  adminUser,
  notifications,
  onOpenPairing,
  onRefresh,
  isRefreshing,
  onOpenNotifications
}) => {
  const t = translations[lang];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-[#0B0F1A]/95 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Left: Device Selector */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-blue-500/50 transition cursor-pointer">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t.pairedDevice}</p>
              <p className="text-xs font-bold text-white max-w-[200px] truncate">
                {selectedDevice ? selectedDevice.name : t.selectDevice}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute left-0 mt-1 w-72 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50">
            <p className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5 tracking-wider">
              {t.totalDevices} ({devices.length})
            </p>
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => onSelectDevice(device)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition ${
                  selectedDevice?.id === device.id
                    ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <p className="font-semibold">{device.name}</p>
                  <p className="text-[10px] text-slate-400">{device.model} • {device.assignedFamilyMember}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span className="text-[10px] font-mono text-slate-400">{device.battery.level}%</span>
                </div>
              </button>
            ))}
            <div className="pt-1.5 mt-1 border-t border-slate-800">
              <button
                onClick={onOpenPairing}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-cyan-400 hover:bg-blue-900/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.pairNewDevice}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Device Status Pill */}
        {selectedDevice && (
          <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-900/50 border border-slate-800 text-xs">
            {/* Status dot */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${selectedDevice.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-slate-300 capitalize">{selectedDevice.status}</span>
            </div>
            <span className="text-slate-700">|</span>
            {/* Battery */}
            <div className="flex items-center gap-1.5 text-slate-300 font-mono">
              <Battery className={`w-3.5 h-3.5 ${selectedDevice.battery.level < 20 ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span>{selectedDevice.battery.level}%</span>
            </div>
            <span className="text-slate-700">|</span>
            {/* Wi-Fi SSID */}
            <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[150px]">
              <Wifi className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate">{selectedDevice.network.ssid}</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Refresh Sync Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition disabled:opacity-50"
          title={t.refresh}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Pair New Device Action */}
        <button
          onClick={onOpenPairing}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.pairNewDevice}</span>
        </button>

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
          title={t.navNotifications}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Admin User Info */}
        {adminUser && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center">
              <img
                src={adminUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={adminUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white leading-tight truncate max-w-[140px]">{adminUser.name}</p>
              <div className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-cyan-400" />
                <p className="text-[10px] text-slate-400 capitalize">{adminUser.role} Guardian</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
