import {
  TeamPair,
  MatchNode,
  MatchRef,
  RoundKey,
  WinnersMap,
  ScoresMap,
  BracketState,
  DayScheduleConfig,
  ScheduleSlot,
  SerializableMatchItem,
} from '../types/bracket';

export const ACCESS_KEY = 'SEVIMA2026';
export const STORAGE_KEY = 'sevima-bracket-state-v1';

export const DEFAULT_TEAMS: TeamPair[] = [
  ["Pras - Ega", "D22A"], ["Aden - Laila", "D10"],
  ["Reva - Nanda", "D14B"], ["Afrizal - Nadiyah", "D18"],
  ["Yoga - Frida", "D19B"], ["Safaat - Devi", "D25B"],
  ["Alam - Ferli", "D24A"], ["Fauzan - Sabrina", "D9"],
  ["Faaris - Nurin", "D22B"], ["Agus - Murni", "D23B"],
  ["Adam - Rinda", "D8"], ["Kresna - Stefany", "D5"],
  ["Hanif - Saltsa", "D19A"], ["Alwi - Silvi", "D11"],
  ["Made - Ai", "D3"], ["Aditya - Monic", "D24B"],
  ["Rizaldi - Shesil", "D15B"], ["Darwin - Nesya", "D23A"],
  ["Yafie - Ivo", "D12A"], ["Zidane - Jenni", "D17A"],
  ["Oi - Zidni", "D12B"], ["Toni - Sabilla", "D13"],
  ["Hatta - Maria", "D2A"], ["Langgeng - Henny", "D20B"],
  ["Dzikry - Karin", "D17B"], ["Dicky - Iis", "D20A"],
  ["Daffa - Zella", "D16B"], ["Rivan - Galuh", "D4"],
  ["Fahrul - Winda", "D1"], ["Reza - Adel", "D15A"],
  ["Shohib - Feli", "D25A"], ["Anjar - Dina", "D2B"],
  ["Kukuh - Manda", "D14A"], ["Zidan - Aliyah", "D16A"]
];

export function districtOf(code: string): string {
  return code.replace(/[A-Z]$/, '');
}

export function firstRoundHasDistrictClash(teamsList: TeamPair[]): boolean {
  for (let k = 0; k < 17; k++) {
    if (districtOf(teamsList[2 * k][1]) === districtOf(teamsList[2 * k + 1][1])) {
      return true;
    }
  }
  return false;
}

export function shuffleTeamsNoDistrictClash(teamsList: TeamPair[]): TeamPair[] {
  const result = [...teamsList];
  const MAX_ATTEMPTS = 5000;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    if (!firstRoundHasDistrictClash(result)) {
      return result;
    }
  }
  return result;
}

export const teamRef = (idx: number): MatchRef => ({ type: 'team', idx });
export const winRef = (matchId: string): MatchRef => ({ type: 'winnerOf', matchId });
export const loserRef = (matchId: string): MatchRef => ({ type: 'loserOf', matchId });

export const MATCHES: Record<string, MatchNode> = {};

MATCHES['P1'] = { id: 'P1', round: 'P', team1: teamRef(30), team2: teamRef(31) };
MATCHES['P2'] = { id: 'P2', round: 'P', team1: teamRef(32), team2: teamRef(33) };

for (let i = 0; i < 15; i++) {
  MATCHES[`R32-${i + 1}`] = { id: `R32-${i + 1}`, round: 'R32', team1: teamRef(2 * i), team2: teamRef(2 * i + 1) };
}
MATCHES['R32-16'] = { id: 'R32-16', round: 'R32', team1: winRef('P1'), team2: winRef('P2') };

for (let i = 0; i < 8; i++) {
  MATCHES[`R16-${i + 1}`] = { id: `R16-${i + 1}`, round: 'R16', team1: winRef(`R32-${2 * i + 1}`), team2: winRef(`R32-${2 * i + 2}`) };
}
for (let i = 0; i < 4; i++) {
  MATCHES[`QF-${i + 1}`] = { id: `QF-${i + 1}`, round: 'QF', team1: winRef(`R16-${2 * i + 1}`), team2: winRef(`R16-${2 * i + 2}`) };
}
for (let i = 0; i < 2; i++) {
  MATCHES[`SF-${i + 1}`] = { id: `SF-${i + 1}`, round: 'SF', team1: winRef(`QF-${2 * i + 1}`), team2: winRef(`QF-${2 * i + 2}`) };
}
MATCHES['F-1'] = { id: 'F-1', round: 'F', team1: winRef('SF-1'), team2: winRef('SF-2') };
MATCHES['P3-1'] = { id: 'P3-1', round: 'P3', team1: loserRef('SF-1'), team2: loserRef('SF-2') };

export const ROUND_ORDER: RoundKey[] = ['P', 'R32', 'R16', 'QF', 'SF', 'F', 'P3'];

export const ROUND_IDS: Record<RoundKey, string[]> = {
  P: ['P1', 'P2'],
  R32: Array.from({ length: 16 }, (_, i) => `R32-${i + 1}`),
  R16: Array.from({ length: 8 }, (_, i) => `R16-${i + 1}`),
  QF: Array.from({ length: 4 }, (_, i) => `QF-${i + 1}`),
  SF: ['SF-1', 'SF-2'],
  F: ['F-1'],
  P3: ['P3-1'],
};

export const ROUND_LABELS: Record<string, string> = {
  P: 'Pra-Babak',
  R32: '32 Besar',
  R16: '16 Besar',
  QF: 'Perempat Final',
  SF: 'Semifinal',
  F: 'Final',
  P3: 'Perebutan Juara 3',
};

// Layout geometry calculations
export const CARD_W = 210;
export const CARD_H = 60;
export const PITCH = 88;
export const PRE_W = 168;
export const PRE_H = 56;
export const PRE_PITCH = 80;
export const GAP_X = 84;
export const MARGIN_TOP = 56;
export const P3_GAP = 120;
export const CHAMP_W = 220;
export const CHAMP_H = 90;

export const r32Centers = Array.from({ length: 16 }, (_, i) => MARGIN_TOP + i * PITCH + PITCH / 2);
export const r16Centers = Array.from({ length: 8 }, (_, i) => (r32Centers[2 * i] + r32Centers[2 * i + 1]) / 2);
export const qfCenters = Array.from({ length: 4 }, (_, i) => (r16Centers[2 * i] + r16Centers[2 * i + 1]) / 2);
export const sfCenters = Array.from({ length: 2 }, (_, i) => (qfCenters[2 * i] + qfCenters[2 * i + 1]) / 2);
export const fCenter = (sfCenters[0] + sfCenters[1]) / 2;
export const preCenters = [r32Centers[15] - PRE_PITCH / 2, r32Centers[15] + PRE_PITCH / 2];

export const CENTER_OF: Record<string, number> = {};
ROUND_IDS.R32.forEach((id, i) => (CENTER_OF[id] = r32Centers[i]));
ROUND_IDS.R16.forEach((id, i) => (CENTER_OF[id] = r16Centers[i]));
ROUND_IDS.QF.forEach((id, i) => (CENTER_OF[id] = qfCenters[i]));
ROUND_IDS.SF.forEach((id, i) => (CENTER_OF[id] = sfCenters[i]));
CENTER_OF['F-1'] = fCenter;
CENTER_OF['P1'] = preCenters[0];
CENTER_OF['P2'] = preCenters[1];
CENTER_OF['P3-1'] = fCenter + P3_GAP;

export const xPre = 0;
export const xR32 = xPre + PRE_W + GAP_X;
export const xR16 = xR32 + CARD_W + GAP_X;
export const xQF = xR16 + CARD_W + GAP_X;
export const xSF = xQF + CARD_W + GAP_X;
export const xF = xSF + CARD_W + GAP_X;
export const xChamp = xF + CARD_W + GAP_X;

export const X_OF: Record<string, number> = {
  P: xPre,
  R32: xR32,
  R16: xR16,
  QF: xQF,
  SF: xSF,
  F: xF,
  P3: xF,
};

export const TOTAL_WIDTH = xChamp + CHAMP_W + 20;
export const TOTAL_HEIGHT = Math.max(MARGIN_TOP + 16 * PITCH + 60, CENTER_OF['P3-1'] + CHAMP_H / 2 + 40);

export function resolveTeamName(
  ref: MatchRef,
  teamsList: TeamPair[],
  winners: WinnersMap
): string | null {
  if (ref.type === 'team') return teamsList[ref.idx]?.[0] || null;
  if (ref.type === 'loserOf') {
    const w = winners[ref.matchId];
    if (!w) return null;
    const mm = MATCHES[ref.matchId];
    const t1 = resolveTeamName(mm.team1, teamsList, winners);
    const t2 = resolveTeamName(mm.team2, teamsList, winners);
    return t1 === w ? t2 : t1;
  }
  return winners[ref.matchId] || null;
}

export function codeOf(ref: MatchRef, teamsList: TeamPair[]): string | null {
  if (ref.type === 'team') return teamsList[ref.idx]?.[1] || null;
  return null;
}

export function getDependencies(matchId: string): string[] {
  const m = MATCHES[matchId];
  if (!m) return [];
  return [m.team1, m.team2]
    .filter((ref): ref is { type: 'winnerOf' | 'loserOf'; matchId: string } => ref.type === 'winnerOf' || ref.type === 'loserOf')
    .map((ref) => ref.matchId);
}

export const COURT_COUNT = 3;

export function scheduleDayMatches(ids: string[]): { slots: { wave: number; court: number; matchId: string }[]; waveCount: number } {
  const idSet = new Set(ids);
  const remaining = new Set(ids);
  const finishedWave: Record<string, number> = {};
  const slots: { wave: number; court: number; matchId: string }[] = [];
  let wave = 0;

  while (remaining.size > 0) {
    const ready = ids.filter((id) => {
      if (!remaining.has(id)) return false;
      return getDependencies(id)
        .filter((dep) => idSet.has(dep))
        .every((dep) => finishedWave[dep] !== undefined && finishedWave[dep] < wave);
    });

    if (ready.length === 0) break;

    const chosen = ready.slice(0, COURT_COUNT);
    chosen.forEach((id, ci) => {
      slots.push({ wave, court: ci + 1, matchId: id });
      finishedWave[id] = wave;
      remaining.delete(id);
    });
    wave++;
  }
  return { slots, waveCount: wave };
}

export const INITIAL_SCHEDULE_DAYS: DayScheduleConfig[] = [
  {
    date: '2026-08-18',
    dateLabel: 'Selasa, 18 Agustus 2026',
    duration: 25,
    start: { hour: 17, minute: 15 },
    windowEnd: { hour: 21, minute: 0 },
    dresscode: 'Baju Sevima',
    ids: ['P1', 'P2', ...ROUND_IDS.R32],
  },
  {
    date: '2026-08-19',
    dateLabel: 'Rabu, 19 Agustus 2026',
    duration: 35,
    start: { hour: 18, minute: 0 },
    windowEnd: { hour: 21, minute: 0 },
    dresscode: 'Baju Merah Putih',
    ids: [...ROUND_IDS.R16, ...ROUND_IDS.QF],
  },
  {
    date: '2026-08-20',
    dateLabel: 'Kamis, 20 Agustus 2026',
    duration: 40,
    start: { hour: 18, minute: 0 },
    windowEnd: { hour: 21, minute: 0 },
    dresscode: 'Baju senada dengan pasangan',
    ids: [...ROUND_IDS.SF, ...ROUND_IDS.P3, ...ROUND_IDS.F],
  },
];

export function computeScheduleSlots(days: DayScheduleConfig[]): { slots: ScheduleSlot[]; updatedDays: DayScheduleConfig[] } {
  const scheduleSlots: ScheduleSlot[] = [];
  const updatedDays = days.map((day) => {
    const { slots, waveCount } = scheduleDayMatches(day.ids);
    slots.forEach((s) => {
      scheduleSlots.push({
        date: day.date,
        wave: s.wave,
        court: s.court,
        matchId: s.matchId,
        round: ROUND_LABELS[MATCHES[s.matchId]?.round] || '',
      });
    });
    return { ...day, waveCount };
  });
  return { slots: scheduleSlots, updatedDays };
}

export function formatClock(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return String(h).padStart(2, '0') + '.' + String(m).padStart(2, '0');
}

export function waveTimeRange(day: DayScheduleConfig, wave: number): { start: string; end: string } {
  const startMin = day.start.hour * 60 + day.start.minute + wave * day.duration;
  return { start: formatClock(startMin), end: formatClock(startMin + day.duration) };
}

export function getSerializableState(
  isLocked: boolean,
  teamsList: TeamPair[],
  winners: WinnersMap,
  scores: ScoresMap
): BracketState {
  const matchesState: SerializableMatchItem[] = ROUND_ORDER.flatMap((round) =>
    ROUND_IDS[round].map((matchId) => {
      const m = MATCHES[matchId];
      return {
        id: matchId,
        round: m.round,
        roundLabel: ROUND_LABELS[m.round],
        team1: resolveTeamName(m.team1, teamsList, winners),
        team2: resolveTeamName(m.team2, teamsList, winners),
        team1Code: codeOf(m.team1, teamsList),
        team2Code: codeOf(m.team2, teamsList),
        winner: winners[matchId] || null,
        score: scores[matchId] ? [String(scores[matchId][0] ?? ''), String(scores[matchId][1] ?? '')] : ['', ''],
      };
    })
  );

  return {
    version: 1,
    savedAt: new Date().toISOString(),
    isLocked,
    teams: teamsList.map(([name, code]) => [name, code]),
    winners: { ...winners },
    scores: Object.fromEntries(
      Object.entries(scores).map(([matchId, pair]) => [matchId, [String(pair[0] ?? ''), String(pair[1] ?? '')]])
    ),
    matches: matchesState,
  };
}
