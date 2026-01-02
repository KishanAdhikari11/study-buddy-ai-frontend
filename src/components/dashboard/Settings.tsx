import React from 'react';
import { LucideIcon, Edit2, Copy } from 'lucide-react';

// A wrapper for settings sections (Profile, Preferences, etc.)
export const SettingsCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 mb-6">
    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">{title}</h3>
    <div className="space-y-6">{children}</div>
  </div>
);

// Individual data rows (Email, Language, User ID)
interface InfoRowProps {
  label: string;
  value: string;
  icon: LucideIcon;
  onEdit?: () => void;
  canCopy?: boolean;
}

export const InfoRow = ({ label, value, icon: Icon, onEdit, canCopy }: InfoRowProps) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-white/5 rounded-xl">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <p className="text-[11px] text-gray-500 font-medium">{label}</p>
        <p className="text-sm text-gray-200">{value}</p>
      </div>
    </div>
    <div className="flex gap-2">
      {canCopy && (
        <button 
          onClick={() => navigator.clipboard.writeText(value)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Copy className="w-3.5 h-3.5 text-gray-400" />
        </button>
      )}
      {onEdit && (
        <button onClick={onEdit} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Edit2 className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
        </button>
      )}
    </div>
  </div>
);