import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const STORAGE_KEY = 'road-safety-progress';

const INITIAL_PROGRESS = {
  completedTopics: [],
  viewedRules: [],
  quizScores: {},
  lastSyncedAt: null,
};

function loadLocal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...INITIAL_PROGRESS };
    const parsed = JSON.parse(saved);
    // Merge with defaults in case schema evolved
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch {
    return { ...INITIAL_PROGRESS };
  }
}

function saveLocal(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* quota exceeded — ignore */ }
}

/** Merge two progress objects (union of sets, latest wins for scores) */
function mergeProgress(local, remote) {
  const merged = { ...INITIAL_PROGRESS };
  merged.completedTopics = [...new Set([...local.completedTopics, ...remote.completedTopics])];
  merged.viewedRules = [...new Set([...local.viewedRules, ...remote.viewedRules])];
  merged.quizScores = { ...remote.quizScores, ...local.quizScores };
  // Keep whichever timestamp is newer
  merged.lastSyncedAt = [local.lastSyncedAt, remote.lastSyncedAt]
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0] || null;
  return merged;
}

export function useProgress(userId) {
  const [progress, setProgress] = useState(loadLocal);

  // Persist to localStorage on every change
  useEffect(() => {
    saveLocal(progress);
  }, [progress]);

  // When user logs in: pull remote and merge
  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) return;

    (async () => {
      const { data } = await supabase
        .from('user_progress')
        .select('progress')
        .eq('user_id', userId)
        .single();

      if (data?.progress) {
        setProgress((prev) => {
          const merged = mergeProgress(prev, data.progress);
          return merged;
        });
      }
    })();
  }, [userId]);

  // ── Teach mode ──
  const completeTopic = useCallback((topicId) => {
    setProgress((prev) => ({
      ...prev,
      completedTopics: [...new Set([...prev.completedTopics, topicId])],
    }));
  }, []);

  const isTopicComplete = useCallback((topicId) => {
    return progress.completedTopics.includes(topicId);
  }, [progress.completedTopics]);

  // ── Rules ──
  const viewRule = useCallback((ruleKey) => {
    setProgress((prev) => ({
      ...prev,
      viewedRules: [...new Set([...prev.viewedRules, ruleKey])],
    }));
  }, []);

  const isRuleViewed = useCallback((ruleKey) => {
    return progress.viewedRules.includes(ruleKey);
  }, [progress.viewedRules]);

  // ── Quiz scores ──
  const setQuizScore = useCallback((topicId, correct) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: { ...prev.quizScores, [topicId]: correct },
    }));
  }, []);

  // ── Sync to Supabase ──
  const syncToRemote = useCallback(async (uid) => {
    if (!uid || !isSupabaseConfigured()) return;
    const toSave = { ...progress, lastSyncedAt: new Date().toISOString() };
    await supabase
      .from('user_progress')
      .upsert({ user_id: uid, progress: toSave, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    setProgress((prev) => ({ ...prev, lastSyncedAt: toSave.lastSyncedAt }));
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress({ ...INITIAL_PROGRESS });
  }, []);

  return {
    progress,
    // Teach mode
    completeTopic,
    isTopicComplete,
    completedCount: progress.completedTopics.length,
    // Rules
    viewRule,
    isRuleViewed,
    viewedCount: progress.viewedRules.length,
    // Quiz
    setQuizScore,
    getQuizScore: (topicId) => progress.quizScores[topicId] ?? null,
    // Sync
    syncToRemote,
    resetProgress,
  };
}
