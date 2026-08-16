import React from 'react';
import { Dices, RotateCcw, Save } from 'lucide-react';

interface ToolbarProps {
  isLocked: boolean;
  onShuffle: () => void;
  onReset: () => void;
  onSaveJson: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isLocked,
  onShuffle,
  onReset,
  onSaveJson,
}) => {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="text-[13px] text-[#7d93b8] flex items-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#d7ff4e] shadow-[0_0_6px_rgba(215,255,78,0.7)] shrink-0" />
        <span>
          Klik nama tim untuk menandai <b className="text-[#eef3f8] font-semibold">pemenang</b>, isi kotak untuk <b className="text-[#eef3f8] font-semibold">skor</b>
        </span>
      </div>

      {!isLocked && (
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onShuffle}
            className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.04em] bg-transparent text-[#7d93b8] border border-[#33517a] px-4 py-2 rounded-md hover:border-[#d7ff4e] hover:text-[#d7ff4e] transition-all duration-150 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7ff4e]"
          >
            <Dices className="w-3.5 h-3.5" /> 🎲 ACAK PENEMPATAN TIM
          </button>
          <button
            type="button"
            onClick={onReset}
            className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.04em] bg-transparent text-[#7d93b8] border border-[#33517a] px-4 py-2 rounded-md hover:border-[#ff6f57] hover:text-[#ff6f57] transition-all duration-150 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6f57]"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ↺ RESET SEMUA HASIL
          </button>
          <button
            type="button"
            onClick={onSaveJson}
            className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.04em] bg-transparent text-[#7d93b8] border border-[#33517a] px-4 py-2 rounded-md hover:border-[#d7ff4e] hover:text-[#d7ff4e] transition-all duration-150 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7ff4e]"
          >
            <Save className="w-3.5 h-3.5" /> 💾 SIMPAN JSON
          </button>
        </div>
      )}
    </div>
  );
};
