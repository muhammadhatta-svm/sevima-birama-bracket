import { BracketState, TeamPair } from '../types/bracket';
import { DEFAULT_TEAMS, MATCHES, STORAGE_KEY } from '../utils/bracketLogic';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'https://api.sinumapat-ai.id/api');

export const BACKEND_BRACKET_ENDPOINT = `${API_URL.replace(/\/$/, '')}/chatbot/bracket`;

export const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer sevima2026',
};

export async function persistState(state: BracketState): Promise<boolean> {
  let localSaved = false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localSaved = true;
  } catch (err) {
    console.warn('Gagal menyimpan state ke localStorage:', err);
  }

  try {
    const response = await fetch(BACKEND_BRACKET_ENDPOINT, {
      method: 'POST',
      headers: AUTH_HEADERS,
      body: JSON.stringify(state),
    });
    if (response.ok) {
      return true;
    } else {
      console.warn('POST state ke BE API gagal dengan status:', response.status);
    }
  } catch (error) {
    console.error('Gagal mengirim state ke Backend API:', error);
  }

  return localSaved;
}

export async function restorePersistedState(): Promise<BracketState | null> {
  try {
    const response = await fetch(BACKEND_BRACKET_ENDPOINT, {
      method: 'GET',
      headers: AUTH_HEADERS,
      cache: 'no-store',
    });
    if (response.ok) {
      const json = await response.json();
      const data = json?.data || json;
      if (validateStateData(data)) {
        const sanitized = sanitizeStateData(data);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        } catch (_) {}
        return sanitized;
      }
    }
  } catch (error) {
    console.warn('Gagal memuat state dari BE API:', error);
  }

  // Fallback ke localStorage jika API error atau tidak mengembalikan data
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const data = JSON.parse(local);
      if (validateStateData(data)) {
        return sanitizeStateData(data);
      }
    }
  } catch (error) {
    console.warn('Gagal memuat state dari localStorage:', error);
  }

  return null;
}

export function downloadStateFile(state: BracketState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bracket-state.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function validateStateData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.teams) || data.teams.length !== DEFAULT_TEAMS.length) return false;
  return true;
}

export function sanitizeStateData(data: any): BracketState {
  const teams: TeamPair[] = data.teams.map((pair: any) => [
    String(pair[0] ?? ''),
    String(pair[1] ?? ''),
  ]);

  const winners: Record<string, string | null> = {};
  const scores: Record<string, [string, string]> = {};

  if (Array.isArray(data.matches) && data.matches.length > 0) {
    data.matches.forEach((item: any) => {
      if (!item || !MATCHES[item.id]) return;
      if (item.winner !== undefined && item.winner !== null) {
        winners[item.id] = String(item.winner);
      }
      if (Array.isArray(item.score) && item.score.length === 2) {
        scores[item.id] = [String(item.score[0] ?? ''), String(item.score[1] ?? '')];
      }
    });
  } else {
    if (data.winners && typeof data.winners === 'object') {
      Object.entries(data.winners).forEach(([matchId, winnerName]) => {
        if (!MATCHES[matchId]) return;
        winners[matchId] = winnerName ? String(winnerName) : null;
      });
    }
    if (data.scores && typeof data.scores === 'object') {
      Object.entries(data.scores).forEach(([matchId, pair]: [string, any]) => {
        if (!MATCHES[matchId] || !Array.isArray(pair) || pair.length !== 2) return;
        scores[matchId] = [String(pair[0] ?? ''), String(pair[1] ?? '')];
      });
    }
  }

  return {
    version: data.version || 1,
    savedAt: data.savedAt || new Date().toISOString(),
    isLocked: data.isLocked !== undefined ? Boolean(data.isLocked) : true,
    teams,
    winners,
    scores,
    matches: data.matches,
  };
}
