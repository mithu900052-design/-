import React, { useState } from 'react';
import { X, QrCode, Smartphone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Device, Language } from '../types';
import { apiClient } from '../api/client';
import { translations } from '../i18n/translations';

interface PairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDevicePaired: (device: Device) => void;
  lang: Language;
}

export const PairingModal: React.FC<PairingModalProps> = ({
  isOpen,
  onClose,
  onDevicePaired,
  lang
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [code, setCode] = useState('');
  const [familyMember, setFamilyMember] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedSampleCode, setGeneratedSampleCode] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim().length !== 6) {
      setErrorMessage('Please enter a 6-digit pairing code');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiClient.verifyPairingCode(code.trim(), familyMember || 'Child Smartphone');
      if (res.device) {
        onDevicePaired(res.device);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to verify pairing code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCodeForTesting = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiClient.generatePairingCode("Family Member Phone", "Android 14 Device");
      setGeneratedSampleCode(res.code);
      setCode(res.code);
    } catch (err: any) {
      setErrorMessage('Failed to generate test pairing code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B0F1A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-cyan-400">
              <QrCode className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">{t.pairingModalTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleVerify} className="p-6 space-y-4">
          <div className="space-y-2 text-xs text-slate-400 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <p className="font-semibold text-slate-300">{t.pairingStep1}</p>
            <p>{t.pairingStep2}</p>
            <p>{t.pairingStep3}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Family Member Label / Assignee
            </label>
            <input
              type="text"
              value={familyMember}
              onChange={(e) => setFamilyMember(e.target.value)}
              placeholder="e.g. Liam (Son, Age 11)"
              className="w-full px-3 py-2 rounded-lg bg-[#080C15] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              One-Time 6-Digit Pairing Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="589214"
              className="w-full px-3 py-2.5 rounded-lg bg-[#080C15] border border-slate-700 text-center text-xl font-mono tracking-widest text-cyan-400 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Helper button to generate code instantly for test without physical device */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleGenerateCodeForTesting}
              disabled={isLoading}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              Need a code? Generate mock Android companion pairing code
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              <span>{t.verifyCodeBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
