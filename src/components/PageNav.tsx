import React from 'react';
import { Calendar, LayoutGrid } from 'lucide-react';

interface PageNavProps {
  activeTab: 'bracket' | 'schedule';
  onTabChange: (tab: 'bracket' | 'schedule') => void;
}

export const PageNav: React.FC<PageNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-4 sm:pt-5 flex flex-wrap items-end justify-between gap-3">
      <div className="flex gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={() => onTabChange('bracket')}
          className={`font-['Oswald',sans-serif] font-semibold text-[13px] tracking-[0.03em] uppercase px-5 py-2.5 rounded-t-lg border transition-all duration-150 flex items-center gap-2 cursor-pointer ${
            activeTab === 'bracket'
              ? 'bg-[#1c3a5e] text-[#d7ff4e] border-[#33517a] border-b-[#d7ff4e]'
              : 'bg-[#16304f] text-[#7d93b8] border-[#33517a] border-b-transparent hover:text-[#eef3f8]'
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> 🏸 Bracket
        </button>
        <button
          type="button"
          onClick={() => onTabChange('schedule')}
          className={`font-['Oswald',sans-serif] font-semibold text-[13px] tracking-[0.03em] uppercase px-5 py-2.5 rounded-t-lg border transition-all duration-150 flex items-center gap-2 cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-[#1c3a5e] text-[#d7ff4e] border-[#33517a] border-b-[#d7ff4e]'
              : 'bg-[#16304f] text-[#7d93b8] border-[#33517a] border-b-transparent hover:text-[#eef3f8]'
          }`}
        >
          <Calendar className="w-4 h-4" /> 🗓️ Jadwal Pertandingan
        </button>
      </div>
    </div>
  );
};

