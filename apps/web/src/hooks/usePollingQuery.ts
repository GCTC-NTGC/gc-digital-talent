import { useEffect, useRef } from "react";
import { AnyVariables, UseQueryArgs, useQuery } from "urql";

import useIsWindowActive from "./useIsWindowActive";

type QueryArgs<TData, TVariables extends AnyVariables> = UseQueryArgs<
  TVariables,
  TData
>;

const usePollingQuery = <TData, TVariables extends AnyVariables>(
  queryArgs: QueryArgs<TData, TVariables>,
  delay: number,
  disabled = false,
): ReturnType<typeof useQuery<TData, TVariables>> => {
  const [result, executeQuery] = useQuery<TData, TVariables>(queryArgs);
  const isWindowActive = useIsWindowActive();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastStartTimeRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(delay * 1000);

  // Reset lastStartTime/remaining
  useEffect(() => {
    remainingRef.current = delay * 1000;
    lastStartTimeRef.current = Date.now();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [delay, disabled, queryArgs.variables]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Do nothing if we are already fetching
    if (disabled || result.fetching) return undefined;

    if (isWindowActive) {
      // Window is active: Start timer with remaining time
      lastStartTimeRef.current = Date.now();
      timeoutRef.current = setTimeout(() => {
        executeQuery({ requestPolicy: "network-only" });
        // After execution, set remaining for next interval
        remainingRef.current = delay * 1000;
        lastStartTimeRef.current = Date.now();
      }, remainingRef.current);
    } else {
      // Window is inactive: Pause timer, record remaining time
      if (lastStartTimeRef.current) {
        const elapsed = Date.now() - lastStartTimeRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [
    result.fetching,
    executeQuery,
    queryArgs.variables,
    delay,
    disabled,
    isWindowActive,
  ]);

  return [result, executeQuery];
};

export default usePollingQuery;
