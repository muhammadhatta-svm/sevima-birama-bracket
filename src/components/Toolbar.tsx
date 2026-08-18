import React, { useRef } from 'react';
import { RotateCcw, Save, Upload } from 'lucide-react';

interface ToolbarProps {
  isLocked: boolean;
  onReset: () => void;
  onSaveJson: () => void;
  onLoadJson: (file: File) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isLocked,
  onReset,
  onSaveJson,
  onLoadJson,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadJson(file);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-8 pt-4 flex items-center justify-between gap-4 flex-wrap">
      <div className="text-[13px] text-[#7d93b8] flex items-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#d7ff4e] shadow-[0_0_6px_rgba(215,255,78,0.7)] shrink-0" />
        <span>
          {isLocked ? (
            <span className="text-[#ff6f57]">
              Input <b className="font-semibold uppercase">terkunci</b>. Klik gembok di kanan atas untuk membuka kunci.
            </span>
          ) : (
            <>
              Klik nama tim untuk menandai <b className="text-[#eef3f8] font-semibold">pemenang</b>, isi kotak untuk <b className="text-[#eef3f8] font-semibold">skor</b>
            </>
          )}
        </span>
      </div>

      {!isLocked && (
        <div className="flex items-center gap-2.5 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.04em] bg-transparent text-[#7d93b8] border border-[#33517a] px-4 py-2 rounded-md hover:border-[#d7ff4e] hover:text-[#d7ff4e] transition-all duration-150 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7ff4e]"
          >
            <Upload className="w-3.5 h-3.5" /> 📂 MUAT JSON
          </button>
          <button
            type="button"
            onClick={onReset}
            className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.04em] bg-transparent text-[#7d93b8] border border-[#33517a] px-4 py-2 rounded-md hover:border-[#ff6f57] hover:text-[#ff6f57] transition-all duration-150 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6f57]"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ↺ RESET SEMUA
          </button>
          <button
            type="button"
            onClick={onSaveJson}
            className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.04em] bg-[#d7ff4e]/10 text-[#d7ff4e] border border-[#d7ff4e]/40 px-4 py-2 rounded-md hover:bg-[#d7ff4e]/20 transition-all duration-150 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d7ff4e]"
          >
            <Save className="w-3.5 h-3.5" /> 💾 SIMPAN JSON
          </button>
        </div>
      )}
    </div>
  );
};
