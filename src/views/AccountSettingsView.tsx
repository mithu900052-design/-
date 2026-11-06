import React, { useState } from 'react';
import { Settings, Globe, Shield, Lock, Bell, UserCheck, Key, Smartphone } from 'lucide-react';
import { AdminUser, Language } from '../types';
import { translations } from '../i18n/translations';

interface AccountSettingsViewProps {
  adminUser: AdminUser | null;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({
  adminUser,
  lang,
  setLang
}) => {
  const t = translations[lang];

  const [name, setName] = useState(adminUser?.name || 'Mithu Rahman');
  const [email, setEmail] = useState(adminUser?.email || 'mithu900052@gmail.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.navAccountSettings}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Guardian profile, localization language preferences, and session controls.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          Settings updated successfully!
        </div>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Details */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Guardian Identity</span>
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080C15] border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Account</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 rounded-xl bg-[#080C15] border border-slate-800 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
            >
              {t.save}
            </button>
          </form>
        </div>

        {/* Language & Preferences */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Localization &amp; Language / ভাষা</span>
          </h2>

          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Select your preferred dashboard language. All telemetry badges, safety notices, and navigation elements will switch dynamically.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`p-3 rounded-xl border text-left transition ${
                  lang === 'en'
                    ? 'bg-blue-600/20 border-cyan-400 text-white'
                    : 'bg-[#080C15] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <p className="font-bold text-xs">English (US)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Default International</p>
              </button>

              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`p-3 rounded-xl border text-left transition ${
                  lang === 'bn'
                    ? 'bg-blue-600/20 border-cyan-400 text-white'
                    : 'bg-[#080C15] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <p className="font-bold text-xs font-bengali">বাংলা (Bengali)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">স্থানীয় ভাষা</p>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
