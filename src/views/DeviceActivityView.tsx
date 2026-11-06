import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Wifi, 
  MapPin, 
  Battery, 
  Layers, 
  ShieldAlert, 
  Filter, 
  Clock, 
  AlertTriangle, 
  Info 
} from 'lucide-react';
import { Device, Language, DeviceActivityLog } from '../types';
import { translations } from '../i18n/translations';
import { apiClient } from '../api/client';

interface DeviceActivityViewProps {
  device: Device | null;
  lang: Language;
}

export const DeviceActivityView: React.FC<DeviceActivityViewProps> = ({ device, lang }) => {
  const t = translations[lang];
  const [activities, setActivities] = useState<DeviceActivityLog[]>([]);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'alert'>('all');

  useEffect(() => {
    if (!device) return;
    apiClient.getActivities(device.id).then(setActivities).catch(console.error);
  }, [device]);

  if (!device) return null;

  const filtered = activities.filter(
    (act) => severityFilter === 'all' || act.severity === severityFilter
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.navDeviceActivity}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time event logging stream for system transitions, network switches, and safety geofences.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 bg-[#0F172A] p-1 rounded-xl border border-slate-800 text-xs">
          {(['all', 'info', 'warning', 'alert'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                severityFilter === sev
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-xs">No activity records match this filter.</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {filtered.map((act) => (
              <div key={act.id} className="relative group">
                {/* Dot marker */}
                <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-[#0F172A] ${
                  act.severity === 'alert' 
                    ? 'bg-rose-500 ring-4 ring-rose-500/20' 
                    : act.severity === 'warning' 
                    ? 'bg-amber-400' 
                    : 'bg-cyan-400'
                }`} />

                <div className="p-4 rounded-xl bg-[#080C15] border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{act.title}</span>
                      <span className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded font-bold ${
                        act.severity === 'alert'
                          ? 'bg-rose-500/20 text-rose-300'
                          : act.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {act.severity}
                      </span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(act.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
