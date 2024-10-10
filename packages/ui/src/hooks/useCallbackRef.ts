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
  const callbackRef = useRef<T | undefined>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(
    // Note: This is generic so we don't know what will be returned yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    () => ((...args: unknown[]) => callbackRef.current?.(...args)) as T,
    [],
  );
};

export default useCallbackRef;
