import { useState } from "react";

type Primitive = string | number | boolean | null | undefined;

/**
 * Local state seeded from the API that adopts a new server value whenever the
 * server value actually changes.
 *
 * Needed because there are cases where we want to store a specific value from a larger model,
 * without invalidating the cache for the whole model. See #16166, and flags/bookmarks on
 * PoolCandidates.
 *
 * When mutating a bookmark, the component keeps its own copy of the value, but it must still
 * defer when a fresh (non-stale) server value arrives representing the larger model.
 *
 * `identity` ensures we discard the local value if the hook is now representing a value from a
 * different entity, eg a different PoolCandidate.
 *
 * Note about Primitive type: values are restricted to primitive types to keep comparison simple.
 * If there is a use case for it, the restriction to Primitive types could be removed, but the method
 * of comparing serverValue with syncedServer value would need to be refactored - maybe by passing in
 * a `compare` or `isEqual` function?
 *
 * @param serverValue latest value from the API; may be a stale cached copy
 * @param identity identifies which entity the value belongs to; when it changes the local
 *   value is discarded, even if the server value looks unchanged
 */
const useServerSyncedState = <T extends Primitive>(
  serverValue: T,
  identity?: Primitive,
) => {
  const [value, setValue] = useState(serverValue);
  const [synced, setSynced] = useState({ serverValue, identity });

  // Render-phase reconciliation, keyed on a *change* in the server value.
  // Assumption is that state will be changed locally with setValue and serverValue will
  // be temporarily stale. But if serverValue *does* change, we should assume that means a
  // fresh value from the server, which is more authoritative than our local value.
  // Alternatively, a change of identity means this instance now represents a
  // completely different entity, so the local value is meaningless.
  if (serverValue !== synced.serverValue || identity !== synced.identity) {
    setSynced({ serverValue, identity });
    setValue(serverValue);
  }

  return [value, setValue] as const;
};

export default useServerSyncedState;
