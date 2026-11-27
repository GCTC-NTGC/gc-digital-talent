import isEqual from "lodash/isEqual";
import type { EffectCallback, DependencyList } from "react";
import { useRef, useEffect } from "react";

function useDeepCompareMemoize(value: DependencyList): DependencyList {
  const ref = useRef<DependencyList>([]);
  // Reading the ref during render is intentional here
  // oxlint-disable-next-line react/refs
  if (!isEqual(value, ref.current)) {
    // oxlint-disable-next-line react/refs
    ref.current = value;
  }
  // oxlint-disable-next-line react/refs
  return ref.current;
}

/**
 * Identical to React.useEffect except it uses lodash.isEqual to check for dependency changes.
 * @param callback
 * @param dependencies
 */
function useDeepCompareEffect(
  callback: EffectCallback,
  dependencies: DependencyList,
): void {
  // Memoize entire array to ensure consistent hook call order.
  const memoizedDeps = useDeepCompareMemoize(dependencies);

  // Linter cannot statically track variables through custom memoization.
  // oxlint-disable-next-line react/exhaustive-deps
  useEffect(callback, [memoizedDeps]);
}

export default useDeepCompareEffect;
