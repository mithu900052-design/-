import React from 'react';
import { 
  Smartphone, 
  Wifi, 
  Battery, 
  MapPin, 
  Plus, 
  ChevronRight, 
  CheckCircle, 
  HardDrive, 
  Radio, 
  ShieldCheck, 
  Info,
  Layers
} from 'lucide-react';
import { Device, Language } from '../types';
import { translations } from '../i18n/translations';

interface MyDevicesViewProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
  lang: Language;
  onOpenPairing: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenSimulator: () => void;
}

export const MyDevicesView: React.FC<MyDevicesViewProps> = ({
  devices,
  selectedDevice,
  onSelectDevice,
  lang,
  onOpenPairing,
  onNavigateTab,
  onOpenSimulator
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.navMyDevices}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Supervised family Android smartphones registered to your Guardian account.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-blue-500/40 text-cyan-300 text-xs font-semibold hover:border-cyan-400 transition"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Companion Simulator</span>
          </button>
          <button
            onClick={onOpenPairing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{t.pairNewDevice}</span>
          </button>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {devices.map((device) => {
          const isSelected = selectedDevice?.id === device.id;
          const storageFreeGb = (device.storage.availableBytes / (1024 * 1024 * 1024)).toFixed(0);

          return (
            <div
              key={device.id}
              onClick={() => onSelectDevice(device)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0F172A] border-blue-500 shadow-xl shadow-blue-500/10'
                  : 'bg-[#0B0F1A] border-slate-800 hover:border-slate-700 hover:bg-[#0F172A]'
              }`}
            >
              <div>
                {/* Top Row: Name & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{device.name}</span>
                        {isSelected && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500 text-slate-900">
                            ACTIVE FOCUS
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-slate-400">{device.model} • {device.assignedFamilyMember}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    device.status === 'online' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                    {device.status.toUpperCase()}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2.5 my-3 text-xs">
                  <div className="bg-[#080C15] p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <Battery className="w-3 h-3 text-emerald-400" />
                      <span>Battery</span>
                    </div>
                    <p className="font-bold text-white font-mono mt-0.5">{device.battery.level}%</p>
                  </div>

                  <div className="bg-[#080C15] p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <Wifi className="w-3 h-3 text-blue-400" />
                      <span>Network</span>
                    </div>
                    <p className="font-bold text-cyan-300 truncate mt-0.5">{device.network.ssid}</p>
                  </div>

                  <div className="bg-[#080C15] p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <Layers className="w-3 h-3 text-purple-400" />
                      <span>Installed Apps</span>
                    </div>
                    <p className="font-bold text-white font-mono mt-0.5">{device.installedApps?.length || 0}</p>
                  </div>
                </div>

                {/* Location address */}
                <div className="p-2.5 rounded-xl bg-[#080C15] border border-slate-800 flex items-center gap-2 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="text-slate-300 truncate text-[11px]">{device.liveLocation.address}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Synced: {new Date(device.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDevice(device);
                    onNavigateTab('device-info');
                  }}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <span>{t.navDeviceInfo}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
