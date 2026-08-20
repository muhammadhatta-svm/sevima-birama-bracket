import React, { useMemo } from 'react';
import { TeamPair, WinnersMap, ScoresMap } from '../types/bracket';
import {
  INITIAL_SCHEDULE_DAYS,
  computeScheduleSlots,
  waveTimeRange,
  formatClock,
  MATCHES,
  resolveTeamName,
} from '../utils/bracketLogic';
import { Calendar, Shirt } from 'lucide-react';

interface ScheduleViewProps {
  teams: TeamPair[];
  winners: WinnersMap;
  scores: ScoresMap;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ teams, winners, scores }) => {
  const { slots: scheduleSlots, updatedDays } = useMemo(() => {
    return computeScheduleSlots(INITIAL_SCHEDULE_DAYS);
  }, []);

  const renderMatchCell = (matchId: string) => {
    const m = MATCHES[matchId];
    if (!m) return null;

    const t1 = resolveTeamName(m.team1, teams, winners);
    const t2 = resolveTeamName(m.team2, teams, winners);
    const w = winners[matchId];

    const sc = scores[matchId];
    const hasScore = sc && sc[0] !== '' && sc[0] != null && sc[1] !== '' && sc[1] != null;

    return (
      <div className="flex flex-col gap-0.5 text-[12px]">
        <div className="font-['JetBrains_Mono',monospace] text-[9px] tracking-[0.06em] uppercase text-[#4d6488]">
          {m.round} · {matchId}
        </div>
        <div className="text-[#eef3f8]">
          {t1 ? (
            w && w === t1 ? (
              <b className="text-[#d7ff4e]">{t1}</b>
            ) : (
              <span>{t1}</span>
            )
          ) : (
            <span className="text-[#4d6488] italic">TBD</span>
          )}

          <span className="text-[#4d6488] mx-1">vs</span>

          {t2 ? (
            w && w === t2 ? (
              <b className="text-[#d7ff4e]">{t2}</b>
            ) : (
              <span>{t2}</span>
            )
          ) : (
            <span className="text-[#4d6488] italic">TBD</span>
          )}

          {hasScore && (
            <span className="inline-block ml-2 px-2 py-0.5 rounded bg-[#d7ff4e]/12 text-[#d7ff4e] font-['JetBrains_Mono',monospace] text-[11px] font-bold whitespace-nowrap">
              {sc[0]}-{sc[1]}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-8 mt-5 pb-16">
      <div className="bg-[#16304f] border border-[#33517a] rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#33517a] pb-4 mb-6">
          <h2 className="font-['Oswald',sans-serif] font-semibold text-[18px] sm:text-[20px] tracking-[0.03em] uppercase text-[#eef3f8] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#d7ff4e]" /> 🗓️ Jadwal Pertandingan
          </h2>
          <div className="font-['JetBrains_Mono',monospace] text-[11px] text-[#7d93b8]">
            3 Lapangan · 3 Hari · 18–20 Agustus 2026
          </div>
        </div>

        <div className="space-y-8">
          {updatedDays.map((day) => {
            const waveCount = day.waveCount || 0;
            const winStartMin = day.start.hour * 60 + day.start.minute;
            const winEndMin = day.windowEnd.hour * 60 + day.windowEnd.minute;
            const lastEnd =
              waveCount > 0
                ? waveTimeRange(day, waveCount - 1).end
                : formatClock(winStartMin);
            const overflow = winStartMin + waveCount * day.duration > winEndMin;

            return (
              <div key={day.date} className="bg-[#0c1f3a]/40 border border-[#33517a]/60 rounded-lg p-4 sm:p-5">
                <div className="border-b border-[#33517a] pb-3 mb-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-['Oswald',sans-serif] font-semibold text-[15px] sm:text-[16px] tracking-[0.03em] uppercase text-[#d7ff4e]">
                      {day.dateLabel}
                    </h3>
                    <div className="font-['JetBrains_Mono',monospace] text-[11px] text-[#7d93b8]">
                      jendela lapangan {formatClock(winStartMin)}–{formatClock(winEndMin)} · {day.duration} menit/partai · selesai ~{lastEnd}
                      {overflow && <span className="text-[#ff6f57] font-semibold ml-1">⚠️ melewati jendela lapangan</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 font-['JetBrains_Mono',monospace] text-[11px] text-[#7d93b8]">
                    <Shirt className="w-3.5 h-3.5 text-[#d7ff4e]" /> Dresscode: <b className="text-[#eef3f8] font-semibold">{day.dresscode}</b>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[720px] text-left">
                    <thead>
                      <tr className="border-b border-[#33517a]">
                        <th className="font-['JetBrains_Mono',monospace] text-[10px] tracking-[0.1em] uppercase text-[#7d93b8] p-2.5 w-24">
                          Waktu
                        </th>
                        <th className="font-['JetBrains_Mono',monospace] text-[10px] tracking-[0.1em] uppercase text-[#7d93b8] p-2.5">
                          Lapangan 1
                        </th>
                        <th className="font-['JetBrains_Mono',monospace] text-[10px] tracking-[0.1em] uppercase text-[#7d93b8] p-2.5">
                          Lapangan 2
                        </th>
                        <th className="font-['JetBrains_Mono',monospace] text-[10px] tracking-[0.1em] uppercase text-[#7d93b8] p-2.5">
                          Lapangan 3
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: waveCount }).map((_, wave) => {
                        const { start, end } = waveTimeRange(day, wave);
                        const daySlots = scheduleSlots.filter(
                          (s) => s.date === day.date && s.wave === wave
                        );

                        const renderCourtCell = (courtNum: number) => {
                          const slot = daySlots.find((s) => s.court === courtNum);
                          if (!slot) {
                            return (
                              <div className="inline-flex flex-col gap-0.5 border border-dashed border-[#33517a] rounded-md px-2.5 py-1">
                                <span className="font-['JetBrains_Mono',monospace] text-[11px] font-bold tracking-[0.08em] text-[#7d93b8]">
                                  FREE TIME
                                </span>
                                <span className="text-[10px] text-[#4d6488] italic">
                                  bebas dipakai semua orang
                                </span>
                              </div>
                            );
                          }
                          return renderMatchCell(slot.matchId);
                        };

                        return (
                          <tr key={`wave-${wave}`} className="border-b border-white/5">
                            <td className="p-2.5 font-['JetBrains_Mono',monospace] text-[#d7ff4e] font-semibold text-[12px] whitespace-nowrap align-top">
                              {start}–{end}
                            </td>
                            <td className="p-2.5 align-top">{renderCourtCell(1)}</td>
                            <td className="p-2.5 align-top">{renderCourtCell(2)}</td>
                            <td className="p-2.5 align-top">{renderCourtCell(3)}</td>
                          </tr>
                        );
                      })}
                      {winStartMin + waveCount * day.duration < winEndMin && (
                        <tr className="border-b border-white/5">
                          <td className="p-2.5 font-['JetBrains_Mono',monospace] text-[#d7ff4e] font-semibold text-[12px] whitespace-nowrap align-top">
                            {lastEnd}–{formatClock(winEndMin)}
                          </td>
                          {[1, 2, 3].map((courtNum) => (
                            <td key={`free-end-${courtNum}`} className="p-2.5 align-top">
                              <div className="inline-flex flex-col gap-0.5 border border-dashed border-[#33517a] rounded-md px-2.5 py-1">
                                <span className="font-['JetBrains_Mono',monospace] text-[11px] font-bold tracking-[0.08em] text-[#7d93b8]">
                                  FREE TIME
                                </span>
                                <span className="text-[10px] text-[#4d6488] italic">
                                  bebas dipakai semua pemain
                                </span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
