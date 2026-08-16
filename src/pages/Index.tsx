import React, { useState, useEffect, useCallback } from 'react';
import { HeroHeader } from '../components/HeroHeader';
import { PageNav } from '../components/PageNav';
import { Toolbar } from '../components/Toolbar';
import { BracketView } from '../components/BracketView';
import { ScheduleView } from '../components/ScheduleView';
import { LockModal } from '../components/LockModal';
import {
  TeamPair,
  WinnersMap,
  ScoresMap,
} from '../types/bracket';
import {
  DEFAULT_TEAMS,
  MATCHES,
  ROUND_ORDER,
  ROUND_IDS,
  shuffleTeamsNoDistrictClash,
  resolveTeamName,
  getSerializableState,
} from '../utils/bracketLogic';
import {
  restorePersistedState,
  persistState,
  downloadStateFile,
  sanitizeStateData,
  validateStateData,
} from '../services/bracketApi';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bracket' | 'schedule'>('bracket');
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isLockModalOpen, setIsLockModalOpen] = useState<boolean>(false);

  const [teams, setTeams] = useState<TeamPair[]>(DEFAULT_TEAMS);
  const [winners, setWinners] = useState<WinnersMap>({});
  const [scores, setScores] = useState<ScoresMap>({});

  // Helper to persist state to API / LocalStorage
  const saveCurrentState = useCallback(
    async (locked: boolean, currentTeams: TeamPair[], currentWinners: WinnersMap, currentScores: ScoresMap) => {
      const serializable = getSerializableState(locked, currentTeams, currentWinners, currentScores);
      await persistState(serializable);
    },
    []
  );

  // Restore state on mount
  useEffect(() => {
    (async () => {
      const persisted = await restorePersistedState();
      if (persisted) {
        setIsLocked(persisted.isLocked);
        setTeams(persisted.teams);
        setWinners(persisted.winners);
        setScores(persisted.scores);
      } else {
        const shuffled = shuffleTeamsNoDistrictClash(DEFAULT_TEAMS);
        setTeams(shuffled);
        await saveCurrentState(true, shuffled, {}, {});
      }
    })();
  }, [saveCurrentState]);

  // Clean stale winners in topological order when winners or teams change
  const cleanStaleWinners = useCallback(
    (currentWinners: WinnersMap, currentTeams: TeamPair[]) => {
      const updated = { ...currentWinners };
      ROUND_ORDER.forEach((r) => {
        ROUND_IDS[r].forEach((id) => {
          const m = MATCHES[id];
          const t1 = resolveTeamName(m.team1, currentTeams, updated);
          const t2 = resolveTeamName(m.team2, currentTeams, updated);
          if (updated[id] && updated[id] !== t1 && updated[id] !== t2) {
            updated[id] = null;
          }
        });
      });
      return updated;
    },
    []
  );

  // Handle picking a winner for a match
  const handlePickWinner = (matchId: string, slot: 1 | 2) => {
    if (isLocked) return;

    const m = MATCHES[matchId];
    if (!m) return;

    const targetTeamName = slot === 1
      ? resolveTeamName(m.team1, teams, winners)
      : resolveTeamName(m.team2, teams, winners);

    if (!targetTeamName) return;

    const nextWinners = { ...winners };
    if (nextWinners[matchId] === targetTeamName) {
      nextWinners[matchId] = null;
    } else {
      nextWinners[matchId] = targetTeamName;
    }

    const cleanedWinners = cleanStaleWinners(nextWinners, teams);
    setWinners(cleanedWinners);
    saveCurrentState(isLocked, teams, cleanedWinners, scores);
  };

  // Handle score change
  const handleScoreChange = (matchId: string, slot: 1 | 2, value: string) => {
    if (isLocked) return;

    const currentPair: [string, string] = scores[matchId] ? [...scores[matchId]] : ['', ''];
    currentPair[slot - 1] = value;

    const nextScores = { ...scores, [matchId]: currentPair };
    setScores(nextScores);
    saveCurrentState(isLocked, teams, winners, nextScores);
  };

  // Handle shuffling teams
  const handleShuffle = () => {
    if (isLocked) return;

    const shuffled = shuffleTeamsNoDistrictClash(teams);
    setTeams(shuffled);
    setWinners({});
    setScores({});
    saveCurrentState(isLocked, shuffled, {}, {});
  };

  // Handle resetting all results
  const handleReset = () => {
    if (isLocked) return;

    setWinners({});
    setScores({});
    saveCurrentState(isLocked, teams, {}, {});
  };

  // Handle saving JSON download
  const handleSaveJson = async () => {
    if (isLocked) return;
    const serializable = getSerializableState(isLocked, teams, winners, scores);
    downloadStateFile(serializable);
    await persistState(serializable);
  };

  // Handle loading JSON file
  const handleLoadJson = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateStateData(data)) {
        alert('Gagal memuat JSON. Format file JSON tidak valid.');
        return;
      }

      const sanitized = sanitizeStateData(data);
      setIsLocked(sanitized.isLocked);
      setTeams(sanitized.teams);
      setWinners(sanitized.winners);
      setScores(sanitized.scores);

      await persistState(sanitized);
    } catch (err) {
      alert('Gagal memuat JSON. Pastikan file JSON valid.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1f3a] text-[#eef3f8] flex flex-col font-['Inter',sans-serif]">
      <HeroHeader isLocked={isLocked} onToggleLock={() => setIsLockModalOpen(true)} />

      <PageNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'bracket' && (
        <main className="flex-1">
          <Toolbar
            isLocked={isLocked}
            onShuffle={handleShuffle}
            onReset={handleReset}
            onSaveJson={handleSaveJson}
          />
          <BracketView
            teams={teams}
            winners={winners}
            scores={scores}
            isLocked={isLocked}
            onPickWinner={handlePickWinner}
            onScoreChange={handleScoreChange}
          />
        </main>
      )}

      {activeTab === 'schedule' && (
        <main className="flex-1">
          <ScheduleView teams={teams} winners={winners} scores={scores} />
        </main>
      )}

      <footer className="text-center text-[#4d6488] text-[12px] py-6 px-4 font-['JetBrains_Mono',monospace] border-t border-white/5 mt-auto">
        Gunakan tombol Simpan JSON agar hasil bisa dipindah dan dimuat di device lain.
      </footer>

      <LockModal
        isOpen={isLockModalOpen}
        isLocked={isLocked}
        onClose={() => setIsLockModalOpen(false)}
        onSuccessUnlock={() => {
          setIsLocked(false);
          saveCurrentState(false, teams, winners, scores);
        }}
        onLock={() => {
          setIsLocked(true);
          saveCurrentState(true, teams, winners, scores);
        }}
      />
    </div>
  );
};

export default Index;
