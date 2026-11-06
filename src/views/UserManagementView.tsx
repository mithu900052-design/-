import React, { useState } from 'react';
import { Users, Plus, Shield, Mail, CheckCircle, Trash2, Key } from 'lucide-react';
import { AdminUser, Language } from '../types';
import { translations } from '../i18n/translations';

interface UserManagementViewProps {
  adminUser: AdminUser | null;
  lang: Language;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  adminUser,
  lang
}) => {
  const t = translations[lang];

  const [guardians, setGuardians] = useState<AdminUser[]>([
    adminUser || {
      id: 'admin_1',
      name: 'Mithu Rahman',
      email: 'mithu900052@gmail.com',
      role: 'Owner',
      twoFactorEnabled: true,
      lastLogin: new Date().toISOString()
    },
    {
      id: 'admin_2',
      name: 'Nusrat Rahman',
      email: 'nusrat.guardian@family.org',
      role: 'Guardian',
      twoFactorEnabled: true,
      lastLogin: new Date(Date.now() - 3600000 * 14).toISOString()
    }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Guardian' | 'Viewer'>('Guardian');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    setGuardians([
      ...guardians,
      {
        id: `admin_${Date.now()}`,
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        twoFactorEnabled: false,
        lastLogin: 'Never'
      }
    ]);
    setInviteEmail('');
    setInviteName('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.navUserManagement}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage authorized family guardians, parental roles, and access credentials.
          </p>
        </div>
      </div>

      {isSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Guardian invitation issued. Email confirmation dispatched.</span>
        </div>
      )}

      {/* Grid: Guardians List + Invite Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 cols: Current Guardians */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Authorized Family Guardians ({guardians.length})</span>
          </h2>

          <div className="divide-y divide-slate-800/80">
            {guardians.map((user) => (
              <div key={user.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-white text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        user.role === 'Owner'
                          ? 'bg-blue-500/20 text-cyan-400 border border-blue-500/30'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <span className="block text-emerald-400 font-mono">2FA Active</span>
                  <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col: Invite Form */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Invite Family Guardian</span>
          </h2>

          <form onSubmit={handleAddGuardian} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Parent or Guardian Name"
                className="w-full px-3 py-2 rounded-xl bg-[#080C15] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="guardian@example.com"
                className="w-full px-3 py-2 rounded-xl bg-[#080C15] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#080C15] border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Guardian">Guardian (View &amp; Manage)</option>
                <option value="Viewer">Viewer (Read-only Location &amp; Battery)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
            >
              Dispatch Guardian Invite
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
