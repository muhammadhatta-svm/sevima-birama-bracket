import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface HeroHeaderProps {
  isLocked: boolean;
  onToggleLock: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ isLocked, onToggleLock }) => {
  return (
    <header className="relative px-4 sm:px-8 pt-12 pb-7 overflow-hidden border-b border-white/5 bg-[#0c1f3a]">
      {/* Court lines SVG background */}
      <svg
        className="absolute inset-0 z-0 opacity-40 pointer-events-none w-full h-full"
        viewBox="0 0 1200 260"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect x="60" y="20" width="1080" height="220" fill="none" stroke="#2a4a75" strokeWidth="1.5" />
        <line x1="600" y1="20" x2="600" y2="240" stroke="#2a4a75" strokeWidth="1.5" />
        <line x1="60" y1="130" x2="1140" y2="130" stroke="#3c6ba0" strokeWidth="2" strokeDasharray="6 6" />
        <rect x="140" y="45" width="920" height="170" fill="none" stroke="#213f66" strokeWidth="1" />
      </svg>

      <div className="relative z-10 max-w-[1100px] mx-auto">
        <div className="font-['JetBrains_Mono',monospace] text-[12px] tracking-[0.16em] uppercase text-[#d7ff4e] mb-3.5 flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6f57] shadow-[0_0_8px_#ff6f57]" />
          Turnamen Badminton - Ganda Campuran
        </div>

        <div className="flex items-start justify-between gap-3.5 mb-2.5">
          <h1 className="font-['Oswald',sans-serif] font-bold text-[32px] sm:text-[44px] md:text-[54px] tracking-[0.01em] uppercase leading-[1.02] text-[#eef3f8]">
            Bracket & <span className="text-[#d7ff4e]">Jadwal Pertandingan</span>
            <br />
            SEVIMA BIRAMA 2026
          </h1>

          <button
            type="button"
            onClick={onToggleLock}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#33517a] bg-[#16304f] text-[#eef3f8] flex items-center justify-center cursor-pointer transition-all duration-150 hover:border-[#d7ff4e] hover:text-[#d7ff4e] focus:outline-none focus:ring-2 focus:ring-[#d7ff4e] shrink-0 mt-1"
            title={isLocked ? 'Buka kunci input' : 'Kunci input'}
            aria-label={isLocked ? 'Buka kunci input' : 'Kunci input'}
          >
            {isLocked ? <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#7d93b8]" /> : <Unlock className="w-4 h-4 sm:w-5 sm:h-5 text-[#d7ff4e]" />}
          </button>
        </div>

        <p className="text-[#7d93b8] text-[14px] sm:text-[15px] max-w-[640px] leading-relaxed mb-6">
          34 tim bertanding dalam format gugur langsung selama 3 hari (18-20 Agustus 2026) di 3 lapangan — hari ketiga khusus 4 tim semifinalis (Semifinal, Perebutan Juara 3, dan Final). Klik nama tim yang menang pada tiap partai untuk memajukannya ke babak berikutnya, isi kotak kecil di sampingnya untuk mencatat skor, atau pakai tombol Acak untuk mengundi ulang penempatan tim. undian otomatis menghindari 2 tim dari district yang sama bertemu di babak pertama (mis. D2A vs D2B). Buka menu Jadwal untuk melihat jam main tiap partai di Lapangan 1, 2, dan 3 tiap harinya.
        </p>

        {/* Roadmap steps */}
        <div className="flex flex-wrap gap-2 items-center font-['JetBrains_Mono',monospace] text-[12px]">
          <div className="bg-[#16304f] border border-[#33517a] rounded-md px-3 py-1.5 text-[#eef3f8] whitespace-nowrap">
            <b className="text-[#d7ff4e] font-semibold">34</b> Tim
          </div>
          <span className="text-[#4d6488]">→</span>
          <div className="bg-[#16304f] border border-[#33517a] rounded-md px-3 py-1.5 text-[#eef3f8] whitespace-nowrap">
            32 Besar <b className="text-[#d7ff4e] font-semibold">18</b> partai
          </div>
          <span className="text-[#4d6488]">→</span>
          <div className="bg-[#16304f] border border-[#33517a] rounded-md px-3 py-1.5 text-[#eef3f8] whitespace-nowrap">
            16 Besar <b className="text-[#d7ff4e] font-semibold">8</b>
          </div>
          <span className="text-[#4d6488]">→</span>
          <div className="bg-[#16304f] border border-[#33517a] rounded-md px-3 py-1.5 text-[#eef3f8] whitespace-nowrap">
            Perempat Final <b className="text-[#d7ff4e] font-semibold">4</b>
          </div>
          <span className="text-[#4d6488]">→</span>
          <div className="bg-[#16304f] border border-[#33517a] rounded-md px-3 py-1.5 text-[#eef3f8] whitespace-nowrap">
            Semifinal <b className="text-[#d7ff4e] font-semibold">2</b>
          </div>
          <span className="text-[#4d6488]">→</span>
          <div className="bg-[#16304f] border border-[#ff6f57] text-[#ff6f57] rounded-md px-3 py-1.5 whitespace-nowrap">
            Juara 3 <b>1</b>
          </div>
          <span className="text-[#4d6488]">→</span>
          <div className="bg-[#16304f] border border-[#33517a] rounded-md px-3 py-1.5 text-[#eef3f8] whitespace-nowrap">
            Final <b className="text-[#d7ff4e] font-semibold">1</b>
          </div>
          <span className="text-[#4d6488]">→</span>
          <div className="bg-[#16304f] border border-[#d7ff4e] text-[#d7ff4e] rounded-md px-3 py-1.5 whitespace-nowrap font-bold">
            Juara 🏆
          </div>
        </div>
      </div>
    </header>
  );
};
