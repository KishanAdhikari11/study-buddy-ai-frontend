import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  onClick: () => void;
}

export const ActionCard = ({ title, description, icon: Icon, iconBg, onClick }: ActionCardProps) => (
  <button 
    onClick={onClick}
    className="flex-1 flex items-center justify-between p-4 bg-[#1a1a1a] border border-white/5 rounded-2xl hover:bg-white/10 transition-all group text-left min-w-[250px]"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl ${iconBg}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
  </button>
);