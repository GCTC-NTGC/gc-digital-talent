/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useMemo } from "react";

type GenericFunc = (...args: any[]) => unknown;

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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
};

export default useCallbackRef;
