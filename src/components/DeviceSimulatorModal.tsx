import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Wifi, 
  Battery, 
  MapPin, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Radio, 
  HardDrive, 
  Layers, 
  Play, 
  QrCode, 
  RefreshCw,
  ScreenShare
} from 'lucide-react';
import { Device, Language } from '../types';
import { apiClient } from '../api/client';
import { translations } from '../i18n/translations';

interface DeviceSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDevice: Device | null;
  onDeviceUpdated: (device: Device) => void;
  lang: Language;
}

export const DeviceSimulatorModal: React.FC<DeviceSimulatorModalProps> = ({
  isOpen,
  onClose,
  selectedDevice,
  onDeviceUpdated,
  lang
}) => {
  if (!isOpen || !selectedDevice) return null;

  const t = translations[lang];

  // Local state for simulator controls
  const [batteryLevel, setBatteryLevel] = useState(selectedDevice.battery.level);
  const [isCharging, setIsCharging] = useState(selectedDevice.battery.isCharging);
  const [wifiSsid, setWifiSsid] = useState(selectedDevice.network.ssid);
  const [networkType, setNetworkType] = useState<'wifi' | 'cellular'>(selectedDevice.network.type as any || 'wifi');
  const [availableGb, setAvailableGb] = useState(Math.round(selectedDevice.storage.availableBytes / (1024 * 1024 * 1024)));
  const [installedAppsConsent, setInstalledAppsConsent] = useState(selectedDevice.installedAppsConsent);
  const [screenSharingConsent, setScreenSharingConsent] = useState(selectedDevice.screenSharingConsentGranted);
  const [isUpdating, setIsUpdating] = useState(false);
  const [simulatedAddress, setSimulatedAddress] = useState(selectedDevice.liveLocation.address);
  const [activePreset, setActivePreset] = useState('Current');

  // Push updates to backend
  const handleApplyTelemetry = async () => {
    setIsUpdating(true);
    try {
      const storageBytes = availableGb * 1024 * 1024 * 1024;
      const res = await apiClient.updateTelemetry(selectedDevice.id, {
        battery: {
          ...selectedDevice.battery,
          level: batteryLevel,
          isCharging: isCharging
        },
        network: {
          ...selectedDevice.network,
          ssid: wifiSsid,
          type: networkType
        },
        storage: {
          ...selectedDevice.storage,
          availableBytes: storageBytes,
          usedBytes: selectedDevice.storage.totalBytes - storageBytes
        }
      });
      if (res.device) {
        onDeviceUpdated(res.device);
      }
    } catch (err) {
      console.error('Failed to update simulated telemetry', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleConsent = async (type: 'installedApps' | 'screenSharing', value: boolean) => {
    setIsUpdating(true);
    try {
      const res = await apiClient.updateConsent(selectedDevice.id, type, value);
      if (type === 'installedApps') setInstalledAppsConsent(value);
      if (type === 'screenSharing') setScreenSharingConsent(value);
      if (res.device) {
        onDeviceUpdated(res.device);
      }
    } catch (err) {
      console.error('Failed to update consent', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLocationPreset = async (name: string, lat: number, lng: number, address: string, speed: number) => {
    setActivePreset(name);
    setSimulatedAddress(address);
    setIsUpdating(true);
    try {
      const res = await apiClient.updateTelemetry(selectedDevice.id, {
        liveLocation: {
          ...selectedDevice.liveLocation,
          latitude: lat,
          longitude: lng,
          address: address,
          speed: speed,
          timestamp: new Date().toISOString()
        }
      });
      if (res.device) {
        onDeviceUpdated(res.device);
      }
    } catch (err) {
      console.error('Failed to update location preset', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B0F1A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Android Companion Simulator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE INTERACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Simulate real device sensors, telemetry, and explicit user consent for <strong className="text-slate-200">{selectedDevice.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
          
          {/* Section 1: Explicit Android Privacy Consents */}
          <div className="p-4 rounded-xl bg-[#080C15] border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400">
                <ShieldAlert className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Device Owner Consent Controls</h3>
              </div>
              <span className="text-[11px] text-slate-400">Must be toggled on companion device</span>
            </div>

            {/* Installed Apps Consent Switch */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="pr-4">
                <p className="text-xs font-semibold text-white">Installed Applications List Consent</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Allows Guardian to view installed app names and versions. Required for Device Information list.
                </p>
              </div>
              <button
                onClick={() => handleToggleConsent('installedApps', !installedAppsConsent)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  installedAppsConsent
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                }`}
              >
                {installedAppsConsent ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{installedAppsConsent ? 'Consent Granted' : 'Denied / Revoked'}</span>
              </button>
            </div>

            {/* Screen Sharing Consent Switch */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="pr-4">
                <p className="text-xs font-semibold text-white">MediaProjection Screen Sharing Authorization</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  User prompt to permit live screen mirroring with persistent ongoing notification.
                </p>
              </div>
              <button
                onClick={() => handleToggleConsent('screenSharing', !screenSharingConsent)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  screenSharingConsent
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                }`}
              >
                <ScreenShare className="w-3.5 h-3.5" />
                <span>{screenSharingConsent ? 'Session Approved' : 'Not Approved'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Battery & Power Telemetry */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
                <Battery className="w-4 h-4 text-emerald-400" />
                <span>Battery & Power Telemetry</span>
              </div>
              <span className="font-mono text-cyan-400 text-sm font-bold">{batteryLevel}%</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Charge Level: {batteryLevel}%</span>
                <span>{isCharging ? '⚡ Charging Active' : '🔋 Discharging'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCharging}
                  onChange={(e) => setIsCharging(e.target.checked)}
                  className="rounded accent-blue-500"
                />
                <span>Simulate Phone Plugged into Charger (AC Fast Charge)</span>
              </label>
            </div>
          </div>

          {/* Section 3: Network & Wireless Connectivity */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
              <Wifi className="w-4 h-4 text-blue-400" />
              <span>Network Connectivity & SSID</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Connection Mode</label>
                <div className="flex rounded-lg bg-[#080C15] p-1 border border-slate-800">
                  <button
                    onClick={() => setNetworkType('wifi')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                      networkType === 'wifi' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Wi-Fi Network
                  </button>
                  <button
                    onClick={() => setNetworkType('cellular')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                      networkType === 'cellular' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Cellular 5G/4G
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Connected SSID / Network Name</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#080C15] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Home_5G_Protected"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Available Storage Simulator */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span>Internal Flash Storage Free Space</span>
              </div>
              <span className="font-mono text-purple-400 text-sm font-bold">{availableGb} GB Free</span>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max={Math.round(selectedDevice.storage.totalBytes / (1024 * 1024 * 1024))}
                value={availableGb}
                onChange={(e) => setAvailableGb(Number(e.target.value))}
                className="flex-1 accent-purple-500 cursor-pointer"
              />
              <span className="text-xs text-slate-400 whitespace-nowrap">
                Total: {Math.round(selectedDevice.storage.totalBytes / (1024 * 1024 * 1024))} GB
              </span>
            </div>
          </div>

          {/* Section 5: GPS Location Movement Presets */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Simulate Child Movement (GPS Telemetry)</span>
            </div>
            <p className="text-xs text-slate-400">
              Current Address: <span className="text-white font-medium">{simulatedAddress}</span>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'Home Banani', lat: 23.7937, lng: 90.4066, address: 'Road 11, Banani, Dhaka', speed: 0 },
                { name: 'School Campus', lat: 23.7745, lng: 90.3654, address: 'Dhaka Residential Model College', speed: 0 },
                { name: 'Transit / Commute', lat: 23.7802, lng: 90.4150, address: 'Gulshan 1 Circle, Dhaka', speed: 38 },
                { name: 'City Park', lat: 23.7465, lng: 90.3760, address: 'Dhanmondi Lake Park, Dhaka', speed: 4 }
              ].map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => handleLocationPreset(loc.name, loc.lat, loc.lng, loc.address, loc.speed)}
                  className={`p-2 rounded-lg text-left border text-xs transition ${
                    activePreset === loc.name
                      ? 'bg-blue-600/30 border-blue-500 text-cyan-300'
                      : 'bg-[#080C15] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <p className="font-bold truncate">{loc.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{loc.speed} km/h</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0B0F1A] flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Changes sync directly to F Spy backend database via REST telemetry API.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Close
            </button>
            <button
              onClick={handleApplyTelemetry}
              disabled={isUpdating}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Push Telemetry to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
