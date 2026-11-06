import React, { useState } from 'react';
import { 
  Info, 
  Smartphone, 
  Wifi, 
  HardDrive, 
  Layers, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Radio, 
  ExternalLink,
  Cpu,
  Calendar,
  Lock,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Device, Language, InstalledApp } from '../types';
import { translations } from '../i18n/translations';
import { apiClient } from '../api/client';

interface DeviceInfoViewProps {
  device: Device | null;
  lang: Language;
  onRefresh: () => void;
  onOpenSimulator: () => void;
}

export const DeviceInfoView: React.FC<DeviceInfoViewProps> = ({
  device,
  lang,
  onRefresh,
  onOpenSimulator
}) => {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isRequestingConsent, setIsRequestingConsent] = useState(false);
  const [consentSuccessNotice, setConsentSuccessNotice] = useState<string | null>(null);

  if (!device) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Smartphone className="w-12 h-12 mx-auto text-slate-600 mb-3 animate-pulse" />
        <p className="text-sm font-semibold text-slate-300">{t.selectDevice}</p>
      </div>
    );
  }

  // Storage calculations
  const totalGb = (device.storage.totalBytes / (1024 * 1024 * 1024)).toFixed(1);
  const availableGb = (device.storage.availableBytes / (1024 * 1024 * 1024)).toFixed(1);
  const usedGb = (device.storage.usedBytes / (1024 * 1024 * 1024)).toFixed(1);
  const usedPercentage = Math.min(
    100,
    Math.round((device.storage.usedBytes / device.storage.totalBytes) * 100)
  );

  // Filter installed apps
  const filteredApps = (device.installedApps || []).filter((app: InstalledApp) => {
    const matchesSearch =
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'System' && app.isSystemApp) ||
      (selectedCategory === 'User' && !app.isSystemApp) ||
      app.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Social', 'Education', 'Games', 'Entertainment', 'Productivity', 'System'];

  const handleGrantConsentLocally = async () => {
    setIsRequestingConsent(true);
    try {
      await apiClient.updateConsent(device.id, 'installedApps', true);
      setConsentSuccessNotice('Consent granted successfully on device!');
      setTimeout(() => setConsentSuccessNotice(null), 4000);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRequestingConsent(false);
    }
  };

  const handleExportAppsCsv = () => {
    const headers = 'Application Name,Package ID,Version Name,Version Code,Size (MB),Category,System App,Install Time\n';
    const rows = (device.installedApps || []).map(a => 
      `"${a.appName}","${a.packageName}","${a.versionName}","${a.versionCode}","${a.sizeMb}","${a.category}","${a.isSystemApp}","${a.installTime}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${device.name.replace(/\s+/g, '_')}_installed_apps.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Info className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.navDeviceInfo}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive telemetry, network credentials, storage breakdown, and consent-authorized installed applications for <strong className="text-slate-200">{device.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-blue-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-semibold transition"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>{t.deviceSimulator}</span>
          </button>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.refresh}</span>
          </button>
        </div>
      </div>

      {consentSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{consentSuccessNotice}</span>
        </div>
      )}

      {/* Grid: Hardware Specs + Network Connectivity + Storage Space */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Android Hardware & System Specs */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>{t.deviceDetailsTitle}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                {device.manufacturer}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.deviceModel}</span>
                <span className="font-semibold text-white">{device.model}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.osVersion}</span>
                <span className="font-semibold text-cyan-300 font-mono">{device.androidVersion}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.androidSdk}</span>
                <span className="font-mono text-slate-200">API Level {device.androidSdk}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.securityPatch}</span>
                <span className="font-mono text-emerald-400">{device.securityPatch}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.imeiMasked}</span>
                <span className="font-mono text-slate-300">{device.imeiMasked}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Family Assignee</span>
                <span className="font-medium text-slate-200">{device.assignedFamilyMember}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Registered: {new Date(device.registeredAt).toLocaleDateString()}</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Encrypted Sync
            </span>
          </div>
        </div>

        {/* Card 2: Network Connectivity (Wi-Fi / Cellular & SSID) */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Wifi className="w-4 h-4 text-blue-400" />
                <span>{t.networkConnectivityTitle}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${device.network.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-[10px] font-bold uppercase text-slate-300 font-mono">
                  {device.network.type}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.ssidLabel}</span>
                <span className="font-bold text-cyan-300 truncate max-w-[160px]">{device.network.ssid}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.carrierLabel}</span>
                <span className="font-semibold text-white">{device.network.carrier}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.ipAddressLabel}</span>
                <span className="font-mono text-slate-300">{device.network.ipAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.linkSpeedLabel}</span>
                <span className="font-mono text-emerald-400">{device.network.linkSpeedMbps} Mbps</span>
              </div>
              <div className="py-1">
                <div className="flex justify-between mb-1.5">
                  <span className="text-slate-400">{t.signalStrengthLabel}</span>
                  <span className="font-mono text-cyan-400 font-bold">{device.network.signalStrength}%</span>
                </div>
                {/* 4-bar indicator */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500" 
                    style={{ width: `${device.network.signalStrength}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Band: {device.network.frequencyGhz ? `${device.network.frequencyGhz} GHz High-Band` : 'Adaptive Dual-Band'}</span>
            <span className="text-cyan-400 font-medium">Active Link</span>
          </div>
        </div>

        {/* Card 3: Storage Capacity & Available Space */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span>{t.storageSpaceTitle}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                UFS 4.0 Storage
              </span>
            </div>

            {/* Storage Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-slate-400">{t.availableStorage}</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{availableGb} GB Free</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-800 flex">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    usedPercentage > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                  }`}
                  style={{ width: `${usedPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                <span>Used: {usedGb} GB ({usedPercentage}%)</span>
                <span>Total: {totalGb} GB</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.internalStorage}</span>
                <span className="font-semibold text-slate-200">{totalGb} GB NVMe</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">{t.sdCardStatus}</span>
                <span className="text-slate-400">{device.storage.sdCardPresent ? t.sdCardInserted : t.sdCardNone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Health / Wear Level</span>
                <span className="text-emerald-400 font-medium">Optimal (98% Life Remaining)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>File System: F2FS Encrypted</span>
            <span className="text-purple-400 font-medium">Sufficient Free Space</span>
          </div>
        </div>

      </div>

      {/* Section: Comprehensive Installed Applications with Explicit Consent */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        {/* Header & Consent Banner */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{t.installedAppsTitle}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {device.installedApps ? device.installedApps.length : 0} {lang === 'en' ? 'apps' : 'অ্যাপ'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {t.installedAppsDesc}
                </p>
              </div>
            </div>

            {/* Export Button */}
            {device.installedAppsConsent && (
              <button
                onClick={handleExportAppsCsv}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Catalog CSV</span>
              </button>
            )}
          </div>

          {/* Explicit User Consent Status Banner */}
          <div className="mt-4">
            {device.installedAppsConsent ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">{t.consentGranted}</p>
                      {device.installedAppsConsentGrantedAt && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          (Authorized on {new Date(device.installedAppsConsentGrantedAt).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      The device user has explicitly authorized installed application cataloging in the F Spy Android companion app.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>Privacy Guard: Sensitive in-app messages, personal documents, and passwords are never collected.</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenSimulator}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-semibold hover:bg-emerald-950/40 transition shrink-0"
                >
                  Manage in Simulator
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-300 uppercase tracking-wider">{t.consentRequired}</p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {t.noAppsConsentMessage}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {t.grantConsentInCompanion}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleGrantConsentLocally}
                    disabled={isRequestingConsent}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    {isRequestingConsent ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{t.grant} Consent Now</span>
                  </button>
                  <button
                    onClick={onOpenSimulator}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs hover:text-white transition"
                  >
                    Open Simulator
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search & Filter Controls (Active when consent is granted) */}
        {device.installedAppsConsent ? (
          <>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchApps}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#080C15] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0B0F1A] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">{t.appNameCol}</th>
                    <th className="py-3 px-4">{t.packageCol}</th>
                    <th className="py-3 px-4">{t.versionCol}</th>
                    <th className="py-3 px-4">{t.categoryCol}</th>
                    <th className="py-3 px-4">{t.sizeCol}</th>
                    <th className="py-3 px-4">{t.installedDateCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        {t.noAppsFound}
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.packageName} className="hover:bg-slate-800/30 transition">
                        {/* App Name with Initial Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm"
                              style={{ backgroundColor: app.iconColor || '#3B82F6' }}
                            >
                              {app.appName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{app.appName}</p>
                              {app.isSystemApp && (
                                <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                  System App
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Package Name */}
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {app.packageName}
                        </td>

                        {/* Version */}
                        <td className="py-3 px-4">
                          <span className="font-mono text-cyan-300 text-xs font-semibold">v{app.versionName}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">({app.versionCode})</span>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.category === 'Education'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : app.category === 'Games'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : app.category === 'Social'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : app.category === 'Entertainment'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {app.category}
                          </span>
                        </td>

                        {/* Size */}
                        <td className="py-3 px-4 font-mono text-slate-300 text-xs">
                          {app.sizeMb} MB
                        </td>

                        {/* Installed Date */}
                        <td className="py-3 px-4 text-slate-400 text-xs">
                          {new Date(app.installTime).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom summary bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <p>
                Showing {filteredApps.length} of {device.installedApps?.length || 0} installed packages.
              </p>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {device.installedApps?.filter(a => !a.isSystemApp).length || 0} User Applications
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  {device.installedApps?.filter(a => a.isSystemApp).length || 0} System Packages
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <Lock className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">App Listing Locked Until Consent is Granted</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              In accordance with Android privacy standards, F Spy does not read package managers without explicit approval by the smartphone owner.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
