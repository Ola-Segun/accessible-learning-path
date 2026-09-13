import { useCallback, useEffect, useState } from "react";
import { loadLearner, saveLearner, type Learner } from "@/lib/learner";

/**
 * Reads the stored learner after mount.
 *
 * Starts null on both server and first client render so the markup agrees;
 * `hydrated` tells callers when the real value has arrived, so identity-
 * dependent UI can hold back rather than flash the signed-out state.
 */
export function useLearner(): {
  learner: Learner | null;
  hydrated: boolean;
  save: (learner: Learner) => void;
  refresh: () => void;
} {
  const [learner, setLearner] = useState<Learner | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLearner(loadLearner());
    setHydrated(true);
  }, []);

  const save = useCallback((next: Learner) => {
    saveLearner(next);
    setLearner(next);
  }, []);

  const refresh = useCallback(() => setLearner(loadLearner()), []);

  return { learner, hydrated, save, refresh };
}
