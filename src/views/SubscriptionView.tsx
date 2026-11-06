import React, { useState } from 'react';
import { CreditCard, Check, ShieldCheck, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { SubscriptionPlan, Language } from '../types';
import { translations } from '../i18n/translations';
import { apiClient } from '../api/client';

interface SubscriptionViewProps {
  subscription: SubscriptionPlan | null;
  onRefresh: () => void;
  lang: Language;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({
  subscription,
  onRefresh,
  lang
}) => {
  const t = translations[lang];
  const [upgrading, setUpgrading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const tiers = [
    {
      id: 'free',
      name: 'Free Trial',
      price: '$0.00',
      period: '/ month',
      maxDevices: 1,
      features: ['1 Android Device', 'Live GPS Tracking', 'Standard Battery Telemetry', '7-Day Location History']
    },
    {
      id: 'basic',
      name: 'Basic Guardian',
      price: '$6.99',
      period: '/ month',
      maxDevices: 2,
      features: ['Up to 2 Android Devices', 'Real-time GPS Tracking', 'Battery & Network Monitor', '14-Day Location History', 'App Usage Duration']
    },
    {
      id: 'premium',
      name: 'Premium Family Shield',
      price: '$12.99',
      period: '/ month',
      maxDevices: 5,
      isPopular: true,
      features: [
        'Up to 5 Android Devices',
        'Live GPS Tracking & Geofences',
        '30-Day Location History Replay',
        'Interactive WebRTC Screen Mirror',
        'Installed Applications Catalog & Versions',
        'Wi-Fi & Cellular SSID Monitor',
        'Thermal & Battery Diagnostics'
      ]
    },
    {
      id: 'pro',
      name: 'Professional Enterprise Guard',
      price: '$24.99',
      period: '/ month',
      maxDevices: 15,
      features: [
        'Up to 15 Supervised Devices',
        'Priority WebRTC Mirror Stream',
        'Unlimited Historical Route Replay',
        'Multi-Guardian Role Access',
        'Detailed App Usage & Storage Audits',
        'Automated Safety Alerts & Webhooks'
      ]
    }
  ];

  const handleSelectTier = async (tierId: string) => {
    setUpgrading(true);
    setNotice(null);
    try {
      await apiClient.upgradeSubscription(tierId);
      setNotice(`Tier updated to ${tierId.toUpperCase()}! Configuration synchronized.`);
      onRefresh();
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      setNotice(err.message || 'Failed to update plan');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.navSubscription}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Subscription tiers, device licensing quotas, and family protection features.
          </p>
        </div>

        {subscription && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next Renewal: <strong className="text-white font-mono">{subscription.renewalDate}</strong></span>
          </div>
        )}
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {tiers.map((tier) => {
          const isCurrent = subscription?.planId === tier.id;

          return (
            <div
              key={tier.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                isCurrent
                  ? 'bg-gradient-to-b from-blue-950/40 via-[#0F172A] to-[#0F172A] border-cyan-400 shadow-xl shadow-blue-500/10'
                  : tier.isPopular
                  ? 'bg-[#0F172A] border-blue-500/60 shadow-lg'
                  : 'bg-[#0B0F1A] border-slate-800 hover:border-slate-700'
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-md">
                  RECOMMENDED FOR FAMILIES
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white">{tier.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      ACTIVE PLAN
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-white font-mono">{tier.price}</span>
                  <span className="text-xs text-slate-400">{tier.period}</span>
                </div>

                <p className="text-xs text-cyan-300 font-semibold mb-4">
                  Allowance: Up to {tier.maxDevices} Android {tier.maxDevices > 1 ? 'Devices' : 'Device'}
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => handleSelectTier(tier.id)}
                  disabled={isCurrent || upgrading}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Switch to ${tier.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
