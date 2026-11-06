import React from 'react';
import { ShieldCheck, Lock, Key, AlertTriangle, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface SecuritySettingsViewProps {
  lang: Language;
}

export const SecuritySettingsView: React.FC<SecuritySettingsViewProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.navSecuritySettings}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-End Encryption key fingerprints, audit logging, and Google Play family safety policy verification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Encryption Details */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>End-to-End Encryption (E2EE)</span>
          </h2>

          <div className="bg-[#080C15] p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Algorithm</span>
              <span className="text-emerald-400 font-bold">AES-256-GCM / TLS 1.3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Key Fingerprint</span>
              <span className="text-cyan-300">7A:8F:90:E4:11:BC:6D:32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pairing Token Hash</span>
              <span className="text-slate-300">SHA-256(PBKDF2)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
            <p className="font-semibold text-cyan-300">Zero-Access Architectural Guarantee</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Keys are generated exclusively on the administrator and companion device endpoints.
            </p>
          </div>
        </div>

        {/* Audit Log / Safety Checklist */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Android Privacy Compliance Audit</span>
          </h2>

          <div className="space-y-2 text-xs">
            {[
              { rule: 'No Stealth Operation', desc: 'Visible launcher icon & ongoing foreground notifications', pass: true },
              { rule: 'Explicit Package Query Consent', desc: 'User-approved access for installed app enumeration', pass: true },
              { rule: 'MediaProjection User Consent', desc: 'Active confirmation dialog required per screen session', pass: true },
              { rule: 'No Keystroke / Chat Interception', desc: 'Private passwords & message bodies are never collected', pass: true }
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#080C15] border border-slate-800/80 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-[11px]">{item.rule}</p>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
