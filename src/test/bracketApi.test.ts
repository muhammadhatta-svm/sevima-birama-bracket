import { describe, it, expect, beforeEach, vi } from 'vitest';
import { persistState, restorePersistedState } from '../services/bracketApi';
import { DEFAULT_TEAMS, getSerializableState, STORAGE_KEY } from '../utils/bracketLogic';

describe('bracketApi persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should persist state to localStorage even if fetch fails', async () => {
    // Mock fetch to reject (network failure)
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const state = getSerializableState(false, DEFAULT_TEAMS, { 'P1': 'Pras - Ega' }, { 'P1': ['21', '19'] });
    const success = await persistState(state);

    expect(success).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it('should restore state from localStorage fallback when fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const state = getSerializableState(false, DEFAULT_TEAMS, { 'P1': 'Pras - Ega' }, { 'P1': ['21', '19'] });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    const restored = await restorePersistedState();
    expect(restored).not.toBeNull();
    expect(restored?.isLocked).toBe(false);
    expect(restored?.winners['P1']).toBe('Pras - Ega');
    expect(restored?.scores['P1']).toEqual(['21', '19']);
  });
});
