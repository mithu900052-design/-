import React, { useEffect, useRef, useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Activity, 
  Battery, 
  Radio, 
  Crosshair, 
  Clock, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import L from 'leaflet';
import { Device, Language } from '../types';
import { translations } from '../i18n/translations';
import { apiClient } from '../api/client';

interface LiveLocationViewProps {
  device: Device | null;
  lang: Language;
  onRefresh: () => void;
  onOpenSimulator: () => void;
}

export const LiveLocationView: React.FC<LiveLocationViewProps> = ({
  device,
  lang,
  onRefresh,
  onOpenSimulator
}) => {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || !device) return;

    const lat = device.liveLocation.latitude;
    const lng = device.liveLocation.longitude;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView([lat, lng], 15);

      // Dark style tile layer (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom pulsing blue marker
      const customIcon = L.divIcon({
        className: 'custom-live-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px;">
            <div style="position: absolute; inset: 0; background: rgba(0, 102, 255, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; inset: 4px; background: #0066FF; border: 2px solid #00D2FF; border-radius: 50%; box-shadow: 0 0 12px #00D2FF; display: flex; align-items: center; justify-content: center; color: white;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="color: #0F172A; font-family: sans-serif; font-size: 12px; padding: 2px;">
          <strong>${device.name}</strong><br/>
          <span>${device.liveLocation.address}</span><br/>
          <small>Speed: ${device.liveLocation.speed} km/h • Accuracy: ±${device.liveLocation.accuracy}m</small>
        </div>
      `);

      const circle = L.circle([lat, lng], {
        radius: device.liveLocation.accuracy || 15,
        color: '#0066FF',
        fillColor: '#0066FF',
        fillOpacity: 0.15,
        weight: 1
      }).addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;
      circleRef.current = circle;
    } else {
      // Update existing map
      const map = mapInstanceRef.current;
      map.setView([lat, lng], map.getZoom());
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      if (circleRef.current) {
        circleRef.current.setLatLng([lat, lng]);
        circleRef.current.setRadius(device.liveLocation.accuracy || 15);
      }
    }

    return () => {
      // cleanup on unmount
    };
  }, [device]);

  const handlePingGps = async () => {
    if (!device) return;
    setIsPinging(true);
    setPingSuccess(false);
    try {
      // Request ping / update
      await apiClient.updateTelemetry(device.id, {
        liveLocation: {
          ...device.liveLocation,
          timestamp: new Date().toISOString()
        }
      });
      setPingSuccess(true);
      onRefresh();
      setTimeout(() => setPingSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPinging(false);
    }
  };

  const handleCenterMap = () => {
    if (mapInstanceRef.current && device) {
      mapInstanceRef.current.setView([device.liveLocation.latitude, device.liveLocation.longitude], 16);
    }
  };

  if (!device) return null;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Title & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <MapPin className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.liveMapTitle}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time GPS tracking stream authorized under Android Foreground Location Service.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-blue-500/40 text-cyan-300 text-xs font-semibold hover:border-cyan-400 transition"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Move Device GPS in Simulator</span>
          </button>
          <button
            onClick={handlePingGps}
            disabled={isPinging}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? 'Pinging GPS...' : 'Request Instant Ping'}</span>
          </button>
        </div>
      </div>

      {pingSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>GPS satellite lock confirmed. Position refreshed from device hardware GPS sensor.</span>
        </div>
      )}

      {/* Main Map Box */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0F172A] shadow-2xl h-[520px]">
        {/* Leaflet Container */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Telemetry Overlay Card */}
        <div className="absolute top-4 left-4 z-20 max-w-sm bg-[#0B0F1A]/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-xs font-bold text-white">{device.name}</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-400">
              {device.liveLocation.speed > 0 ? `${device.liveLocation.speed} km/h` : 'Stationary'}
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            {device.liveLocation.address}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-[#080C15] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">{t.currentCoordinates}</span>
              <span className="font-mono text-cyan-300 font-semibold text-xs">
                {device.liveLocation.latitude.toFixed(4)}, {device.liveLocation.longitude.toFixed(4)}
              </span>
            </div>
            <div className="bg-[#080C15] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">{t.accuracyMeters}</span>
              <span className="font-mono text-emerald-400 font-semibold text-xs">
                ±{device.liveLocation.accuracy} meters
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Altitude: {device.liveLocation.altitude}m</span>
            <span>Synced: {new Date(device.liveLocation.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Map Floating Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={handleCenterMap}
            className="p-2.5 rounded-xl bg-[#0F172A]/90 hover:bg-slate-800 text-cyan-400 border border-slate-700 shadow-xl transition"
            title={t.centerOnDevice}
          >
            <Crosshair className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};
