export type TeamPair = [string, string]; // [names, districtCode] e.g. ["Hatta - Maria", "D2A"]

export type MatchRef =
  | { type: 'team'; idx: number }
  | { type: 'winnerOf'; matchId: string }
  | { type: 'loserOf'; matchId: string };

export interface MatchNode {
  id: string;
  round: string;
  team1: MatchRef;
  team2: MatchRef;
}

export type RoundKey = 'P' | 'R32' | 'R16' | 'QF' | 'SF' | 'F' | 'P3';

export type WinnersMap = Record<string, string | null>;
export type ScoresMap = Record<string, [string, string]>;

export interface SerializableMatchItem {
  id: string;
  round: string;
  roundLabel: string;
  team1: string | null;
  team2: string | null;
  team1Code: string | null;
  team2Code: string | null;
  winner: string | null;
  score: [string, string];
}

export interface BracketState {
  version: number;
  savedAt: string;
  isLocked: boolean;
  teams: TeamPair[];
  winners: WinnersMap;
  scores: ScoresMap;
  matches?: SerializableMatchItem[];
}

export interface DayScheduleConfig {
  date: string;
  dateLabel: string;
  duration: number;
  start: { hour: number; minute: number };
  windowEnd: { hour: number; minute: number };
  dresscode: string;
  ids: string[];
  maxCourts?: number;
  waveCount?: number;
}

export interface ScheduleSlot {
  date: string;
  wave: number;
  court: number;
  matchId: string;
  round: string;
}
