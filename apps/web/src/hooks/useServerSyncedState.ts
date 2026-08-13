import { useState } from "react";

/**
 * Local state seeded from the API that adopts a new server value whenever the
 * server value actually changes.
 *
 * Needed because there are cases where we want to store a specific value from a larger model,
 * without invalidating the cache for the whole model. See #16166, and flags/bookmarks on
 * PoolCandidates.
 * When mutating a bookmark, the component keeps its own copy of the value, but it must still
 * defer when a fresh (non-stale) server value arrives representing the larger model.
 *
 * @param serverValue latest value from the API; may be a stale cached copy
 */
const useServerSyncedState = <T>(serverValue: T) => {
  const [value, setValue] = useState(serverValue);
  const [lastServerValue, setLastServerValue] = useState(serverValue);

  // Render-phase reconciliation, keyed on a *change* in the server value: after a
  // toggle the cache still serves the old value, and re-delivering it must not
  // clobber what the mutation just confirmed.
  if (serverValue !== lastServerValue) {
    setLastServerValue(serverValue);
    setValue(serverValue);
  }

  return [value, setValue] as const;
};

export default useServerSyncedState;
