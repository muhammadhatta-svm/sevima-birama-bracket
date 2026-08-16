import React from 'react';
import { MatchNode } from '../types/bracket';
import { CARD_W, CARD_H, PRE_W, PRE_H, CENTER_OF, X_OF } from '../utils/bracketLogic';

interface MatchCardProps {
  match: MatchNode;
  team1Name: string | null;
  team1Code: string | null;
  team2Name: string | null;
  team2Code: string | null;
  winner: string | null;
  scores: [string, string];
  isLocked: boolean;
  onPickWinner: (matchId: string, slot: 1 | 2) => void;
  onScoreChange: (matchId: string, slot: 1 | 2, value: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  team1Name,
  team1Code,
  team2Name,
  team2Code,
  winner,
  scores,
  isLocked,
  onPickWinner,
  onScoreChange,
}) => {
  const isPre = match.round === 'P';
  const isP3 = match.round === 'P3';
  const w = isPre ? PRE_W : CARD_W;
  const h = isPre ? PRE_H : CARD_H;
  const cy = CENTER_OF[match.id];
  const x = X_OF[match.round];

  const isTbd1 = !team1Name;
  const isTbd2 = !team2Name;

  const isWinner1 = winner && winner === team1Name;
  const isWinner2 = winner && winner === team2Name;

  const isLoser1 = winner && team1Name && winner !== team1Name;
  const isLoser2 = winner && team2Name && winner !== team2Name;

  return (
    <div
      className={`absolute bg-gradient-to-b from-[#1c3a5e] to-[#16304f] border border-[#33517a] rounded-[9px] shadow-[0_6px_18px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col justify-between ${
        isPre || isP3 ? 'border-l-[3px] border-l-[#ff6f57]' : ''
      }`}
      style={{
        left: `${x}px`,
        top: `${cy - h / 2}px`,
        width: `${w}px`,
        height: `${h}px`,
      }}
    >
      {/* Row 1 (Team 1) */}
      <div
        className={`flex items-center gap-1.5 w-full h-[50%] ${
          isPre ? 'px-2 gap-1' : 'px-2.5'
        } transition-colors duration-150 ${isWinner1 ? 'bg-[#d7ff4e]/5' : ''}`}
      >
        <button
          type="button"
          disabled={isLocked || isTbd1}
          onClick={() => onPickWinner(match.id, 1)}
          className={`flex items-center gap-2 overflow-hidden flex-1 min-w-0 h-full text-left bg-transparent border-0 p-0 ${
            isLocked || isTbd1 ? 'cursor-default' : 'cursor-pointer hover:bg-[#d7ff4e]/10 focus:outline-none focus:ring-1 focus:ring-[#d7ff4e]'
          }`}
        >
          <div className="flex flex-col overflow-hidden leading-none">
            <span
              className={`truncate text-[13px] ${isPre ? 'text-[12px]' : ''} ${
                isWinner1
                  ? 'text-[#d7ff4e] font-bold'
                  : isLoser1
                  ? 'text-[#4d6488] line-through decoration-[#4d6488]'
                  : isTbd1
                  ? 'text-[#4d6488] italic'
                  : 'text-[#eef3f8] font-medium'
              }`}
            >
              {team1Name || 'TBD'}
            </span>
            {team1Code && (
              <span className="font-['JetBrains_Mono',monospace] text-[9px] text-[#4d6488] tracking-wider mt-0.5">
                {team1Code}
              </span>
            )}
          </div>
        </button>

        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          placeholder="-"
          disabled={isLocked || isTbd1}
          value={scores[0] || ''}
          onChange={(e) => onScoreChange(match.id, 1, e.target.value)}
          className={`shrink-0 text-center bg-white/5 border border-[#33517a] rounded text-[#eef3f8] font-['JetBrains_Mono',monospace] placeholder-[#4d6488] focus:outline-none focus:ring-1 focus:ring-[#d7ff4e] focus:border-[#d7ff4e] disabled:opacity-35 ${
            isPre ? 'w-[18px] text-[9px] py-0 px-0' : 'w-[22px] text-[11px] py-0 px-0'
          }`}
          aria-label="Skor tim 1"
        />

        <div
          className={`w-3.5 h-3.5 rounded-full shrink-0 border flex items-center justify-center ${
            isWinner1
              ? 'border-[#d7ff4e] bg-[#d7ff4e]'
              : 'border-[#33517a]'
          }`}
        >
          {isWinner1 && (
            <div className="w-1 h-2 border-r-2 border-b-2 border-[#0c1f3a] rotate-45 -translate-y-0.5" />
          )}
        </div>
      </div>

      <div className="h-[1px] bg-[#33517a] w-full" />

      {/* Row 2 (Team 2) */}
      <div
        className={`flex items-center gap-1.5 w-full h-[50%] ${
          isPre ? 'px-2 gap-1' : 'px-2.5'
        } transition-colors duration-150 ${isWinner2 ? 'bg-[#d7ff4e]/5' : ''}`}
      >
        <button
          type="button"
          disabled={isLocked || isTbd2}
          onClick={() => onPickWinner(match.id, 2)}
          className={`flex items-center gap-2 overflow-hidden flex-1 min-w-0 h-full text-left bg-transparent border-0 p-0 ${
            isLocked || isTbd2 ? 'cursor-default' : 'cursor-pointer hover:bg-[#d7ff4e]/10 focus:outline-none focus:ring-1 focus:ring-[#d7ff4e]'
          }`}
        >
          <div className="flex flex-col overflow-hidden leading-none">
            <span
              className={`truncate text-[13px] ${isPre ? 'text-[12px]' : ''} ${
                isWinner2
                  ? 'text-[#d7ff4e] font-bold'
                  : isLoser2
                  ? 'text-[#4d6488] line-through decoration-[#4d6488]'
                  : isTbd2
                  ? 'text-[#4d6488] italic'
                  : 'text-[#eef3f8] font-medium'
              }`}
            >
              {team2Name || 'TBD'}
            </span>
            {team2Code && (
              <span className="font-['JetBrains_Mono',monospace] text-[9px] text-[#4d6488] tracking-wider mt-0.5">
                {team2Code}
              </span>
            )}
          </div>
        </button>

        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          placeholder="-"
          disabled={isLocked || isTbd2}
          value={scores[1] || ''}
          onChange={(e) => onScoreChange(match.id, 2, e.target.value)}
          className={`shrink-0 text-center bg-white/5 border border-[#33517a] rounded text-[#eef3f8] font-['JetBrains_Mono',monospace] placeholder-[#4d6488] focus:outline-none focus:ring-1 focus:ring-[#d7ff4e] focus:border-[#d7ff4e] disabled:opacity-35 ${
            isPre ? 'w-[18px] text-[9px] py-0 px-0' : 'w-[22px] text-[11px] py-0 px-0'
          }`}
          aria-label="Skor tim 2"
        />

        <div
          className={`w-3.5 h-3.5 rounded-full shrink-0 border flex items-center justify-center ${
            isWinner2
              ? 'border-[#d7ff4e] bg-[#d7ff4e]'
              : 'border-[#33517a]'
          }`}
        >
          {isWinner2 && (
            <div className="w-1 h-2 border-r-2 border-b-2 border-[#0c1f3a] rotate-45 -translate-y-0.5" />
          )}
        </div>
      </div>
    </div>
  );
};
