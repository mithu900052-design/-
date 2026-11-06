import React, { useState, useEffect } from 'react';
import { 
  History, 
  MapPin, 
  Calendar, 
  Clock, 
  Download, 
  Play, 
  Pause, 
  RotateCcw,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import { Device, Language, LocationRecord } from '../types';
import { translations } from '../i18n/translations';
import { apiClient } from '../api/client';

interface LocationHistoryViewProps {
  device: Device | null;
  lang: Language;
}

export const LocationHistoryView: React.FC<LocationHistoryViewProps> = ({
  device,
  lang
}) => {
  const t = translations[lang];
  const [history, setHistory] = useState<LocationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<LocationRecord | null>(null);

  useEffect(() => {
    if (!device) return;
    setIsLoading(true);
    apiClient.getLocationHistory(device.id)
      .then(records => {
        setHistory(records);
        if (records.length > 0) setSelectedRecord(records[0]);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [device]);

  const handleExportGpx = () => {
    if (!device || history.length === 0) return;
    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="F Spy Family Protection">
  <trk>
    <name>${device.name} Route History</name>
    <trkseg>
      ${history.map(pt => `<trkpt lat="${pt.latitude}" lon="${pt.longitude}"><ele>${pt.altitude}</ele><time>${pt.timestamp}</time></trkpt>`).join('\n      ')}
    </trkseg>
  </trk>
</gpx>`;
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${device.name.replace(/\s+/g, '_')}_route.gpx`;
    link.click();
  };

  if (!device) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <History className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.locationHistoryTitle}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical GPS breadcrumb records logged with timestamp and travel speed metrics.
          </p>
        </div>

        <button
          onClick={handleExportGpx}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.exportGpx}</span>
        </button>
      </div>

      {/* Grid: Timeline Table + Selected Waypoint Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 cols: Records Table */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Breadcrumb Route Points ({history.length})</span>
            </h2>
            <span className="text-xs text-slate-400">Retained for 30 Days</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B0F1A] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Location Address</th>
                  <th className="py-2.5 px-3">Speed</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No location history recorded yet.
                    </td>
                  </tr>
                ) : (
                  history.map((record) => {
                    const isSelected = selectedRecord?.id === record.id;
                    return (
                      <tr 
                        key={record.id} 
                        onClick={() => setSelectedRecord(record)}
                        className={`cursor-pointer transition ${isSelected ? 'bg-blue-600/20' : 'hover:bg-slate-800/40'}`}
                      >
                        <td className="py-2.5 px-3 font-mono text-cyan-300 text-xs">
                          {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-3 max-w-[240px] truncate text-slate-200">
                          {record.address}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-xs">
                          {record.speed > 0 ? `${record.speed} km/h` : 'Stopped'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-xs">
                          ±{record.accuracy}m
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isSelected ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isSelected ? 'Viewing' : 'Select'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Waypoint Detail View */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4 text-white font-bold text-sm">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Waypoint Details</span>
            </div>

            {selectedRecord ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Geocoded Location</span>
                  <p className="font-semibold text-white mt-0.5">{selectedRecord.address}</p>
                </div>

                <div className="bg-[#080C15] p-3 rounded-xl border border-slate-800 space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Latitude</span>
                    <span className="text-cyan-300 font-bold">{selectedRecord.latitude.toFixed(6)}° N</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Longitude</span>
                    <span className="text-cyan-300 font-bold">{selectedRecord.longitude.toFixed(6)}° E</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Velocity</span>
                    <span className="text-emerald-400 font-bold">{selectedRecord.speed} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Altitude</span>
                    <span className="text-slate-300">{selectedRecord.altitude} meters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timestamp</span>
                    <span className="text-slate-300 text-[11px]">{new Date(selectedRecord.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-10">Select a point from the table to inspect.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Precision: High Accuracy GPS</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Fix
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
