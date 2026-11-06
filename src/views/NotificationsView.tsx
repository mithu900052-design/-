import React from 'react';
import { Bell, Trash2, CheckCircle2, AlertTriangle, Shield, Clock } from 'lucide-react';
import { NotificationItem, Language } from '../types';
import { translations } from '../i18n/translations';
import { apiClient } from '../api/client';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onRefresh: () => void;
  lang: Language;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onRefresh,
  lang
}) => {
  const t = translations[lang];

  const handleClearAll = async () => {
    await apiClient.clearNotifications();
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Bell className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.navNotifications}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time push alerts regarding battery warnings, geofence arrivals, and permission changes.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold border border-slate-700 transition self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Notifications</span>
          </button>
        )}
      </div>

      {/* Notifications Feed */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500/50" />
            <p className="text-sm font-semibold text-slate-300">All caught up!</p>
            <p className="text-xs text-slate-500">No active safety warnings or notifications at this moment.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition flex items-start gap-3.5 ${
                !item.read
                  ? 'bg-blue-950/20 border-blue-500/30'
                  : 'bg-[#080C15] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-white">{item.title}</h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
