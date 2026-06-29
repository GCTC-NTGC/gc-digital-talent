import isEqual from "lodash/isEqual";
import type { EffectCallback, DependencyList } from "react";
import { useRef, useEffect } from "react";

function useDeepCompareMemoize(value: DependencyList): DependencyList {
  const ref = useRef<DependencyList>([]);
  // Reading the ref during render is intentional here
  // eslint-disable-next-line react-hooks/refs
  if (!isEqual(value, ref.current)) {
    // eslint-disable-next-line react-hooks/refs
    ref.current = value;
  }
  // eslint-disable-next-line react-hooks/refs
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
  // this function was added to eslint so deps will be checked at the calling location

  // Memoize entire array to ensure consistent hook call order.
  const memoizedDeps = useDeepCompareMemoize(dependencies);

  // Linter cannot statically track variables through custom memoization.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, [memoizedDeps]);
}

export default useDeepCompareEffect;
