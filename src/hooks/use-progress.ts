import { useCallback, useEffect, useState } from "react";
import { loadAll, type ProgressMap } from "@/lib/progress";

/**
 * Reads persisted progress after mount.
 *
 * Deliberately starts empty on both server and first client render so the two
 * agree; `hydrated` tells callers when the real values have arrived, so
 * progress-dependent UI can hold back rather than flash the wrong state.
 */
export function useProgressMap(): {
  progress: ProgressMap;
  hydrated: boolean;
  refresh: () => void;
} {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => setProgress(loadAll()), []);

  useEffect(() => {
    setProgress(loadAll());
    setHydrated(true);
  }, []);

  return { progress, hydrated, refresh };
}
