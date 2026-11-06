import React, { useState, useRef, useEffect } from 'react';
import { 
  ScreenShare, 
  Play, 
  Square, 
  ShieldAlert, 
  CheckCircle, 
  Radio, 
  Smartphone, 
  Video, 
  Wifi, 
  AlertTriangle 
} from 'lucide-react';
import { Device, Language } from '../types';
import { translations } from '../i18n/translations';
import { apiClient } from '../api/client';

interface ScreenSharingViewProps {
  device: Device | null;
  lang: Language;
  onRefresh: () => void;
  onOpenSimulator: () => void;
}

export const ScreenSharingView: React.FC<ScreenSharingViewProps> = ({
  device,
  lang,
  onRefresh,
  onOpenSimulator
}) => {
  const t = translations[lang];
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamMode, setStreamMode] = useState<'simulated' | 'webrtc_capture'>('simulated');
  const [screenFrameIndex, setScreenFrameIndex] = useState(0);

  const screens = [
    { app: 'One UI Home Launcher', color: '#0F172A', time: '14:32', battery: '78%' },
    { app: 'Duolingo: Spanish Unit 4', color: '#10B981', time: '14:33', battery: '77%' },
    { app: 'YouTube Kids (Educational)', color: '#DC2626', time: '14:35', battery: '76%' },
    { app: 'Google Classroom Homework', color: '#2563EB', time: '14:38', battery: '75%' }
  ];

  useEffect(() => {
    let interval: any;
    if (isStreaming && streamMode === 'simulated') {
      interval = setInterval(() => {
        setScreenFrameIndex((prev) => (prev + 1) % screens.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isStreaming, streamMode]);

  const handleStartStream = async () => {
    setStreamError(null);
    if (!device?.screenSharingConsentGranted) {
      setStreamError('User has not approved screen sharing on the Android companion phone. Open the simulator or companion app to approve.');
      return;
    }

    try {
      if (streamMode === 'webrtc_capture' && navigator.mediaDevices?.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
      setIsStreaming(true);
      await apiClient.updateTelemetry(device.id, { screenSharingActive: true });
    } catch (err: any) {
      console.warn('Display media capture skipped/cancelled, falling back to simulated screen stream', err);
      setStreamMode('simulated');
      setIsStreaming(true);
    }
  };

  const handleStopStream = async () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    if (device) {
      await apiClient.updateTelemetry(device.id, { screenSharingActive: false });
    }
  };

  if (!device) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <ScreenShare className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.screenSharingTitle}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t.screenSharingDesc}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-blue-500/40 text-cyan-300 text-xs font-semibold hover:border-cyan-400 transition"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Consent Controls in Simulator</span>
          </button>
        </div>
      </div>

      {/* Explicit Consent Requirement Banner */}
      {!device.screenSharingConsentGranted ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Android MediaProjection Consent Required
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                {t.waitingForConsent} In accordance with Android security policies, screen sharing cannot be started silently or without owner agreement.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSimulator}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shrink-0"
          >
            Approve in Simulator
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Device owner has authorized live screen mirroring for this session. Continuous foreground notification is active on the target device.</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            AUTHORIZED
          </span>
        </div>
      )}

      {streamError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{streamError}</span>
        </div>
      )}

      {/* Screen Mirror Viewer Box */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
        
        {/* Stream Control Bar */}
        <div className="w-full max-w-2xl flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isStreaming ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {isStreaming ? 'LIVE WEBRTC TRANSMISSION' : 'MIRROR STANDBY'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-[#080C15] p-1 border border-slate-800 text-[11px]">
              <button
                onClick={() => setStreamMode('simulated')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  streamMode === 'simulated' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Simulated Screen
              </button>
              <button
                onClick={() => setStreamMode('webrtc_capture')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  streamMode === 'webrtc_capture' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Browser DisplayMedia
              </button>
            </div>

            {!isStreaming ? (
              <button
                onClick={handleStartStream}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.startScreenStream}</span>
              </button>
            ) : (
              <button
                onClick={handleStopStream}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-500/20"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{t.stopScreenStream}</span>
              </button>
            )}
          </div>
        </div>

        {/* Smartphone Frame Container */}
        <div className="relative w-[340px] h-[640px] rounded-[42px] bg-[#000000] p-3 shadow-2xl border-4 border-slate-700/80 flex flex-col overflow-hidden">
          
          {/* Top Notch / Camera Pill */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          {/* Screen Content */}
          <div className="relative flex-1 rounded-[32px] overflow-hidden bg-[#080C15] flex flex-col justify-between text-white p-4">
            
            {/* Real WebRTC Video Tag */}
            {streamMode === 'webrtc_capture' && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover z-20 ${!isStreaming ? 'hidden' : ''}`}
              />
            )}

            {isStreaming ? (
              <div className="relative z-10 flex flex-col h-full justify-between animate-in fade-in duration-500">
                {/* Phone Status Bar */}
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 pt-1 px-2">
                  <span>{screens[screenFrameIndex].time}</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3 h-3 text-cyan-400" />
                    <span>{screens[screenFrameIndex].battery}</span>
                  </div>
                </div>

                {/* Simulated App View */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl"
                    style={{ backgroundColor: screens[screenFrameIndex].color }}
                  >
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Active Application</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{screens[screenFrameIndex].app}</h3>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400">
                    <p>Live Screen Frame: 1080 × 2400 @ 30 FPS</p>
                    <p className="text-emerald-400 mt-0.5">End-to-End Encrypted VP9 Stream</p>
                  </div>
                </div>

                {/* Persistent Android Ongoing Notification Indicator */}
                <div className="p-2 rounded-lg bg-blue-900/50 border border-blue-500/40 text-[10px] text-blue-200 flex items-center gap-2">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse shrink-0" />
                  <span>F Spy Foreground Protection Active</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                <Video className="w-12 h-12 text-slate-600" />
                <p className="text-xs font-semibold text-slate-300">Mirror Feed Inactive</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Click "{t.startScreenStream}" above to view the child's screen live.
                </p>
              </div>
            )}

          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-1.5" />
        </div>

      </div>

    </div>
  );
};
