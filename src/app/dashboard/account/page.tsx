'use client';

import React from 'react';
import { Mail, Globe, User, LogOut } from 'lucide-react';
import { SettingsCard, InfoRow } from '@/components/dashboard/Settings';

export default function SettingsPage() {
  const user = {
    name: "Kishan Adhikary",
    email: "kexhunadkary@gmail.com",
    language: "English",
    id: "6fd29395-99ee-40ad-9c86-0..."
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/auth/login';
  };

  return (
    <div className="p-4 sm:p-10 max-w-4xl mx-auto">
      <div className="mb-10 text-left">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 text-center">
            <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-white mb-6">{user.name}</h2>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/20 text-red-500 hover:bg-red-500/5 rounded-2xl text-sm font-semibold transition-all"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <SettingsCard title="Account Information">
            <InfoRow label="Email Address" value={user.email} icon={Mail} />
            <InfoRow label="User ID" value={user.id} icon={User} canCopy />
          </SettingsCard>

          <SettingsCard title="Preferences">
            <InfoRow 
              label="Content Language" 
              value={user.language} 
              icon={Globe} 
              onEdit={() => {}} 
            />
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}