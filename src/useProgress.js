import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'msq_accounts_v2';
const OLD_STORAGE_KEY = 'msq_progress_v1';

const DEFAULT_PROGRESS = {
  playerName: null,
  currentStage: 1,
  currentSet: 1,
  totalCorrect: 0,
  totalAnswered: 0,
  completedSets: [],  // stored as array in JSON
  perfectSets: [],    // stored as array in JSON
  celebratedStages: [], 
};

/**
 * Custom hook for managing and persisting player progress via localStorage.
 * @returns {object} Progress state and update functions
 */
export function useProgress() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          activeName: parsed.activeName,
          profiles: Object.fromEntries(
            Object.entries(parsed.profiles).map(([name, data]) => [
              name, 
              {
                ...data,
                completedSets: new Set(data.completedSets || []),
                perfectSets: new Set(data.perfectSets || []),
                celebratedStages: new Set(data.celebratedStages || [])
              }
            ])
          )
        };
      }

      // Migration from v1
      const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
      if (oldRaw) {
        const oldData = JSON.parse(oldRaw);
        const name = oldData.playerName || '勇者';
        const migrated = {
          ...oldData,
          completedSets: new Set(oldData.completedSets || []),
          perfectSets: new Set(oldData.perfectSets || []),
          celebratedStages: new Set(oldData.celebratedStages || [])
        };
        return {
          activeName: name,
          profiles: { [name]: migrated }
        };
      }

      return { activeName: null, profiles: {} };
    } catch (e) {
      console.error('Failed to load progress:', e);
      return { activeName: null, profiles: {} };
    }
  });

  const progress = state.activeName ? state.profiles[state.activeName] : {
    ...DEFAULT_PROGRESS,
    completedSets: new Set(),
    perfectSets: new Set(),
    celebratedStages: new Set()
  };

  // Automatically save to localStorage whenever state changes
  useEffect(() => {
    try {
      const toSave = {
        activeName: state.activeName,
        profiles: Object.fromEntries(
          Object.entries(state.profiles).map(([name, data]) => [
            name,
            {
              ...data,
              completedSets: [...data.completedSets],
              perfectSets: [...data.perfectSets],
              celebratedStages: [...data.celebratedStages],
            }
          ])
        )
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }, [state]);

  const updateProgress = useCallback((updater) => {
    setState(prev => {
      if (!prev.activeName) return prev;
      const currentProfile = prev.profiles[prev.activeName];
      const newProfile = typeof updater === 'function' ? updater(currentProfile) : { ...currentProfile, ...updater };
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeName]: newProfile
        }
      };
    });
  }, []);

  const completeSet = useCallback((stage, set, correctCount) => {
    updateProgress((prev) => {
      const key = `${stage}-${set}`;
      const newCompleted = new Set(prev.completedSets);
      newCompleted.add(key);
      const newPerfect = new Set(prev.perfectSets);
      if (correctCount === 10) newPerfect.add(key);

      return {
        ...prev,
        completedSets: newCompleted,
        perfectSets: newPerfect,
        totalCorrect: prev.totalCorrect + correctCount,
        totalAnswered: prev.totalAnswered + 10,
      };
    });
  }, [updateProgress]);

  const advanceTo = useCallback((stage, set) => {
    updateProgress({ currentStage: stage, currentSet: set });
  }, [updateProgress]);

  const setPlayerName = useCallback((name) => {
    setState(prev => {
      const existing = prev.profiles[name];
      if (existing) {
        return { ...prev, activeName: name };
      }
      const newProfile = {
        ...DEFAULT_PROGRESS,
        playerName: name,
        completedSets: new Set(),
        perfectSets: new Set(),
        celebratedStages: new Set()
      };
      return {
        activeName: name,
        profiles: { ...prev.profiles, [name]: newProfile }
      };
    });
  }, []);

  const markStageAsCelebrated = useCallback((stage) => {
    updateProgress((prev) => {
      const newCelebrated = new Set(prev.celebratedStages);
      newCelebrated.add(stage);
      return { ...prev, celebratedStages: newCelebrated };
    });
  }, [updateProgress]);

  const deleteAccount = useCallback((name) => {
    setState(prev => {
      const newProfiles = { ...prev.profiles };
      delete newProfiles[name];
      return {
        activeName: prev.activeName === name ? null : prev.activeName,
        profiles: newProfiles
      };
    });
  }, []);

  const switchAccount = useCallback((name) => {
    setState(prev => ({ ...prev, activeName: name }));
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ activeName: null, profiles: {} });
  }, []);

  return { 
    progress, 
    allAccounts: Object.values(state.profiles).map(p => ({
      ...p,
      completedSets: p.completedSets,
      perfectSets: p.perfectSets,
      celebratedStages: p.celebratedStages
    })),
    activeName: state.activeName,
    completeSet, 
    advanceTo, 
    setPlayerName, 
    markStageAsCelebrated, 
    deleteAccount,
    switchAccount,
    resetAll 
  };
}
