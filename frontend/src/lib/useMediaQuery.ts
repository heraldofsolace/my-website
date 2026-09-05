"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Subscribes to a media query via useSyncExternalStore rather than a
 * useState+useEffect pair — this *is* what that hook is for (syncing to an
 * external mutable source, matchMedia here), and it sidesteps having to
 * hand-write the "read once on mount, then listen for changes" dance
 * (plus its react-hooks/set-state-in-effect complaint about the initial
 * synchronous setState). getServerSnapshot returning false gives the same
 * "starts false, corrects after hydration" behavior a manual effect would,
 * without a real subscription existing to mismatch against on the server. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
