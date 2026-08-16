import React, { useMemo } from 'react';
import {
  TeamPair,
  WinnersMap,
  ScoresMap,
} from '../types/bracket';
import {
  MATCHES,
  ROUND_ORDER,
  ROUND_IDS,
  ROUND_LABELS,
  CARD_W,
  CARD_H,
  PRE_W,
  CHAMP_W,
  CHAMP_H,
  X_OF,
  CENTER_OF,
  TOTAL_WIDTH,
  TOTAL_HEIGHT,
  xPre,
  xR32,
  xF,
  xChamp,
  fCenter,
  resolveTeamName,
  codeOf,
} from '../utils/bracketLogic';
import { MatchCard } from './MatchCard';

interface BracketViewProps {
  teams: TeamPair[];
  winners: WinnersMap;
  scores: ScoresMap;
  isLocked: boolean;
  onPickWinner: (matchId: string, slot: 1 | 2) => void;
  onScoreChange: (matchId: string, slot: 1 | 2, value: string) => void;
}

export const BracketView: React.FC<BracketViewProps> = ({
  teams,
  winners,
  scores,
  isLocked,
  onPickWinner,
  onScoreChange,
}) => {
  // Generate connector paths
  const paths = useMemo(() => {
    const list: { id: string; d: string; isActive: boolean; isLoserFeeder?: boolean }[] = [];

    const drawElbow = (
      feederId: string,
      targetId: string,
      feederIsPre: boolean,
      isLoserFeeder?: boolean
    ) => {
      const w = feederIsPre ? PRE_W : CARD_W;
      const x1 = X_OF[MATCHES[feederId].round] + w;
      const y1 = CENTER_OF[feederId];
      const x2 = X_OF[MATCHES[targetId].round];
      const y2 = CENTER_OF[targetId];
      const xmid = x1 + (x2 - x1) / 2;
      const d = `M ${x1} ${y1} H ${xmid} V ${y2} H ${x2}`;

      const ref = isLoserFeeder
        ? { type: 'loserOf' as const, matchId: feederId }
        : { type: 'winnerOf' as const, matchId: feederId };

      const resolved = isLoserFeeder
        ? resolveTeamName(ref, teams, winners)
        : winners[feederId];

      list.push({
        id: `${feederId}::${targetId}`,
        d,
        isActive: !!resolved,
        isLoserFeeder,
      });
    };

    ROUND_ORDER.forEach((r) => {
      ROUND_IDS[r].forEach((id) => {
        const m = MATCHES[id];
        [m.team1, m.team2].forEach((ref) => {
          if (ref.type === 'winnerOf') {
            drawElbow(ref.matchId, id, MATCHES[ref.matchId].round === 'P');
          } else if (ref.type === 'loserOf') {
            drawElbow(ref.matchId, id, MATCHES[ref.matchId].round === 'P', true);
          }
        });
      });
    });

    // Final -> Champion
    {
      const champWinner = winners['F-1'];
      const x1 = X_OF['F'] + CARD_W;
      const y1 = fCenter;
      const x2 = xChamp;
      const y2 = fCenter;
      const xmid = x1 + (x2 - x1) / 2;
      list.push({
        id: 'champ-final',
        d: `M ${x1} ${y1} H ${xmid} V ${y2} H ${x2}`,
        isActive: !!champWinner,
      });
    }

    // Perebutan Juara 3 -> Juara 3 box
    {
      const p3Winner = winners['P3-1'];
      const x1 = X_OF['P3'] + CARD_W;
      const y1 = CENTER_OF['P3-1'];
      const x2 = xChamp;
      const y2 = CENTER_OF['P3-1'];
      const xmid = x1 + (x2 - x1) / 2;
      list.push({
        id: 'champ-p3',
        d: `M ${x1} ${y1} H ${xmid} V ${y2} H ${x2}`,
        isActive: !!p3Winner,
        isLoserFeeder: true,
      });
    }

    return list;
  }, [teams, winners]);

  const champWinner = winners['F-1'];
  const p3Winner = winners['P3-1'];

  return (
    <div className="w-full overflow-x-auto pt-7 pb-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 mb-1 font-['JetBrains_Mono',monospace] text-[11px] text-[#4d6488]">
        ← geser untuk melihat seluruh bracket →
      </div>

      <div className="relative mx-4 sm:mx-8" style={{ width: `${TOTAL_WIDTH}px` }}>
        {/* Sticky round headers */}
        <div className="sticky top-0 z-20 h-11 bg-gradient-to-b from-[#0c1f3a] via-[#0c1f3a]/90 to-transparent">
          {ROUND_ORDER.map((r) => {
            if (r === 'P' || r === 'P3') return null;

            let left = X_OF[r];
            let width = CARD_W;
            let subText = `${ROUND_IDS[r].length} partai`;

            if (r === 'R32') {
              left = xPre;
              width = xR32 + CARD_W - xPre;
              subText = `${ROUND_IDS.P.length + ROUND_IDS.R32.length} partai · 34 tim`;
            }

            return (
              <div
                key={`header-${r}`}
                className="absolute top-0 font-['JetBrains_Mono',monospace] text-[11px] tracking-[0.12em] uppercase text-[#7d93b8] pb-2 border-b border-[#33517a]"
                style={{ left: `${left}px`, width: `${width}px` }}
              >
                <b className="text-[#eef3f8] font-['Oswald',sans-serif] text-[13px] tracking-[0.04em] block mb-0.5">
                  {ROUND_LABELS[r]}
                </b>
                {subText}
              </div>
            );
          })}

          <div
            className="absolute top-0 font-['JetBrains_Mono',monospace] text-[11px] tracking-[0.12em] uppercase text-[#7d93b8] pb-2 border-b border-[#33517a]"
            style={{ left: `${xChamp}px`, width: `${CHAMP_W}px` }}
          >
            <b className="text-[#eef3f8] font-['Oswald',sans-serif] text-[13px] tracking-[0.04em] block mb-0.5">
              Juara
            </b>
            1 tim
          </div>
        </div>

        {/* Bracket Canvas & SVG lines */}
        <div className="relative" style={{ width: `${TOTAL_WIDTH}px`, height: `${TOTAL_HEIGHT}px` }}>
          <svg
            className="absolute top-0 left-0 overflow-visible pointer-events-none z-0"
            width={TOTAL_WIDTH}
            height={TOTAL_HEIGHT}
            viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}
          >
            {paths.map((p) => (
              <path
                key={p.id}
                d={p.d}
                fill="none"
                strokeWidth={p.isActive ? 2.5 : 2}
                className={`transition-all duration-300 ${
                  p.isActive
                    ? p.isLoserFeeder
                      ? 'stroke-[#ff6f57] [filter:drop-shadow(0_0_4px_rgba(255,111,87,0.55))]'
                      : 'stroke-[#d7ff4e] [filter:drop-shadow(0_0_4px_rgba(215,255,78,0.55))]'
                    : 'stroke-[#33517a] [stroke-dasharray:4_5]'
                }`}
              />
            ))}
          </svg>

          {/* Render All Match Cards */}
          {ROUND_ORDER.flatMap((r) =>
            ROUND_IDS[r].map((matchId) => {
              const m = MATCHES[matchId];
              const t1Name = resolveTeamName(m.team1, teams, winners);
              const t1Code = codeOf(m.team1, teams);
              const t2Name = resolveTeamName(m.team2, teams, winners);
              const t2Code = codeOf(m.team2, teams);
              const currentScores = scores[matchId] || ['', ''];

              return (
                <MatchCard
                  key={matchId}
                  match={m}
                  team1Name={t1Name}
                  team1Code={t1Code}
                  team2Name={t2Name}
                  team2Code={t2Code}
                  winner={winners[matchId] || null}
                  scores={currentScores}
                  isLocked={isLocked}
                  onPickWinner={onPickWinner}
                  onScoreChange={onScoreChange}
                />
              );
            })
          )}

          {/* Champion Box */}
          <div
            className="absolute flex flex-col items-center justify-center gap-1.5 text-center px-4 py-3 rounded-xl border border-[#d7ff4e] shadow-[0_0_0_1px_rgba(215,255,78,0.15),0_10px_30px_rgba(0,0,0,0.35)] bg-[radial-gradient(120%_140%_at_50%_0%,rgba(215,255,78,0.14),#1c3a5e_65%)] z-10"
            style={{
              left: `${xChamp}px`,
              top: `${fCenter - CHAMP_H / 2}px`,
              width: `${CHAMP_W}px`,
              height: `${CHAMP_H}px`,
            }}
          >
            <div className="text-[22px] leading-none">🏆</div>
            <div className="font-['JetBrains_Mono',monospace] text-[10px] tracking-[0.14em] uppercase text-[#d7ff4e]">
              Juara Turnamen
            </div>
            <div
              className={`font-['Oswald',sans-serif] font-semibold text-[16px] text-[#eef3f8] leading-tight ${
                !champWinner ? 'text-[#4d6488] italic font-normal font-sans text-[13px]' : ''
              }`}
            >
              {champWinner || 'Belum ditentukan'}
            </div>
          </div>

          {/* 3rd Place Label */}
          <div
            className="absolute text-center font-['JetBrains_Mono',monospace] text-[10px] tracking-[0.08em] uppercase text-[#ff6f57] z-10"
            style={{
              left: `${xF}px`,
              top: `${CENTER_OF['P3-1'] - CARD_H / 2 - 20}px`,
              width: `${CARD_W}px`,
            }}
          >
            🥉 Perebutan Juara 3
          </div>

          {/* 3rd Place Champion Box */}
          <div
            className="absolute flex flex-col items-center justify-center gap-1 text-center px-4 py-2.5 rounded-xl border border-[#ff6f57]/50 shadow-[0_6px_18px_rgba(0,0,0,0.25)] bg-[radial-gradient(120%_140%_at_50%_0%,rgba(255,111,87,0.12),#16304f_65%)] z-10"
            style={{
              left: `${xChamp}px`,
              top: `${CENTER_OF['P3-1'] - 37}px`,
              width: `${CHAMP_W}px`,
              height: `74px`,
            }}
          >
            <div className="text-[18px] leading-none">🥉</div>
            <div className="font-['JetBrains_Mono',monospace] text-[10px] tracking-[0.14em] uppercase text-[#ff6f57]">
              Juara 3
            </div>
            <div
              className={`font-['Oswald',sans-serif] font-semibold text-[15px] text-[#eef3f8] leading-tight ${
                !p3Winner ? 'text-[#4d6488] italic font-normal font-sans text-[13px]' : ''
              }`}
            >
              {p3Winner || 'Belum ditentukan'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
