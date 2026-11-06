import React from 'react';
import { 
  Battery, 
  BatteryCharging, 
  Zap, 
  Thermometer, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Radio 
} from 'lucide-react';
import { Device, Language } from '../types';
import { translations } from '../i18n/translations';

interface BatteryInfoViewProps {
  device: Device | null;
  lang: Language;
  onOpenSimulator: () => void;
}

export const BatteryInfoView: React.FC<BatteryInfoViewProps> = ({
  device,
  lang,
  onOpenSimulator
}) => {
  const t = translations[lang];
  if (!device) return null;

  const battery = device.battery;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Battery className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.batteryHealthTitle}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Android hardware battery telemetry, thermal diagnostics, and charging metrics.
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-blue-500/40 text-cyan-300 text-xs font-semibold hover:border-cyan-400 transition"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>Adjust Charge in Simulator</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Metric 1: Charge Level */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t.batteryLevel}</span>
            {battery.isCharging ? (
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            ) : (
              <Battery className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <p className="text-3xl font-bold text-white font-mono">{battery.level}%</p>
          <p className="text-[11px] text-cyan-400 mt-1">
            {battery.isCharging ? '⚡ Fast Charger Connected' : 'Discharging Normally'}
          </p>
        </div>

        {/* Metric 2: Health */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t.batteryHealth}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400 font-mono">{battery.health}</p>
          <p className="text-[11px] text-slate-400 mt-1">Cell Cycle Degradation: Normal</p>
        </div>

        {/* Metric 3: Temperature */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t.batteryTemp}</span>
            <Thermometer className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-cyan-300 font-mono">{battery.temperature}°C</p>
          <p className="text-[11px] text-emerald-400 mt-1">Within Safe Thermal Threshold</p>
        </div>

        {/* Metric 4: Cell Voltage */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t.batteryVoltage}</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-purple-300 font-mono">{battery.voltage} mV</p>
          <p className="text-[11px] text-slate-400 mt-1">Power Source: {battery.powerSource}</p>
        </div>
      </div>

      {/* Discharge / Charge Timeline Curve */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white">24-Hour Battery Discharge & Charge Timeline</h2>
          <span className="text-xs text-slate-400 font-mono">100% → {battery.level}%</span>
        </div>

        {/* Visual Simulated SVG Curve */}
        <div className="relative h-44 w-full bg-[#080C15] rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
          </div>

          <svg className="w-full h-24 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0066FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0066FF" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 10 Q 120 25 250 45 T 400 30 T 500 22 L 500 100 L 0 100 Z"
              fill="url(#batteryGrad)"
            />
            <path
              d="M 0 10 Q 120 25 250 45 T 400 30 T 500 22"
              fill="none"
              stroke="#00D2FF"
              strokeWidth="3"
            />
          </svg>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80">
            <span>00:00 (100%)</span>
            <span>06:00 (92%)</span>
            <span>12:00 (84%)</span>
            <span>18:00 (79%)</span>
            <span className="text-cyan-400 font-bold">Now ({battery.level}%)</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Battery Protection Mode: Activated (Prevents overcharge above 85% at night)</span>
          <span className="text-emerald-400 font-mono">Status: Healthy</span>
        </div>
      </div>

    </div>
  );
};
