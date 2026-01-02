import React from 'react';
import { FileText, MoreVertical, Presentation, FileCode } from 'lucide-react';

type FileType = 'pdf' | 'ppt' | 'docx' | 'folder';

interface DocumentRowProps {
  title: string;
  lastOpened: string;
  type: FileType;
  onAction: () => void;
}

const iconMap = {
  pdf: { icon: FileText, color: 'text-red-400', bg: 'bg-red-500/10' },
  ppt: { icon: Presentation, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  docx: { icon: FileCode, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  folder: { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/20' }
};

export const DocumentRow = ({ title, lastOpened, type, onAction }: DocumentRowProps) => {
  const { icon: Icon, color, bg } = iconMap[type];

  return (
    <div className="flex items-center justify-between p-4 bg-[#111111] hover:bg-[#161616] border-b border-white/5 first:rounded-t-2xl last:rounded-b-2xl transition-colors group">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{title}</h4>
          <p className="text-[11px] text-gray-500">Last opened {lastOpened}</p>
        </div>
      </div>
      <button onClick={onAction} className="p-2 hover:bg-white/5 rounded-full transition-colors">
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};