export type LearningStage = 'penginderaan' | 'perenungan' | 'mainake';

export type ActivityType =
  | 'takon_materi'
  | 'nggawe_tembang'
  | 'nganalisis'
  | 'progres';

export interface LearningProgress {
  stage: LearningStage;
  activitiesCompleted: ActivityType[];
  macapatTried: string[];
  tembangCreated: number;
  scores: number[];
  lastActivity?: ActivityType;
}

const STORAGE_KEY = 'sinumapat-learning-progress';

const DEFAULT_PROGRESS: LearningProgress = {
  stage: 'penginderaan',
  activitiesCompleted: [],
  macapatTried: [],
  tembangCreated: 0,
  scores: [],
};

export const ACTIVITY_MESSAGES: Record<ActivityType, string> = {
  takon_materi: 'Aku arep takon materi tembang macapat',
  nggawe_tembang: 'Aku pengin nggawe tembang macapat anyar',
  nganalisis: 'Aku pengin nganalisis tembang macapat',
  progres: 'Tampilna progres sinauku',
};

export const STAGE_LABELS: Record<LearningStage, string> = {
  penginderaan: 'Tahap Penginderaan',
  perenungan: 'Tahap Perenungan',
  mainake: 'Tahap Mainake Tetembungan',
};

export class LearningProgressService {
  static load(): LearningProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_PROGRESS };
      const parsed = JSON.parse(raw) as LearningProgress;
      return { ...DEFAULT_PROGRESS, ...parsed };
    } catch {
      return { ...DEFAULT_PROGRESS };
    }
  }

  static save(progress: LearningProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save learning progress', e);
    }
  }

  static recordActivity(activity: ActivityType): LearningProgress {
    const current = this.load();
    const activitiesCompleted = current.activitiesCompleted.includes(activity)
      ? current.activitiesCompleted
      : [...current.activitiesCompleted, activity];

    let stage = current.stage;
    if (activity === 'takon_materi' || activity === 'nggawe_tembang') {
      stage = 'perenungan';
    } else if (activity === 'nganalisis' || activity === 'progres') {
      stage = 'mainake';
    }

    const updated: LearningProgress = {
      ...current,
      stage,
      activitiesCompleted,
      lastActivity: activity,
    };
    this.save(updated);
    return updated;
  }

  static recordScore(score: number): void {
    const current = this.load();
    this.save({
      ...current,
      scores: [...current.scores, score],
    });
  }

  static recordMacapat(macapat: string): void {
    const current = this.load();
    const normalized = macapat.toLowerCase();
    if (current.macapatTried.includes(normalized)) return;
    this.save({
      ...current,
      macapatTried: [...current.macapatTried, normalized],
    });
  }

  static recordTembangCreated(): void {
    const current = this.load();
    this.save({
      ...current,
      tembangCreated: current.tembangCreated + 1,
    });
  }

  static getAverageScore(): number | null {
    const { scores } = this.load();
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }
}
