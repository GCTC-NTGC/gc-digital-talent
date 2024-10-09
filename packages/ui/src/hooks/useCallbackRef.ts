import { useRef, useEffect, useMemo } from "react";

// Note: This is a generic type and can accept any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFunc = (...args: any[]) => any;

/**
 * Stabilize a callback with React.useRef
 *
 * Ref: https://github.com/radix-ui/primitives/tree/main/packages/react/use-callback-ref
 */
const useCallbackRef = <T extends GenericFunc>(callback: T | undefined): T => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(
    () => ((...args: unknown[]) => callbackRef.current?.(...args)) as T,
    [],
  );
};

export default useCallbackRef;
