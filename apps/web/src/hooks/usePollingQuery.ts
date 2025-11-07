import { useEffect } from "react";
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

  useEffect(() => {
    // Do nothing if we are already fetching
    if (!result.fetching && !disabled && isWindowActive) {
      const timeout = setTimeout(() => {
        executeQuery({ requestPolicy: "network-only" });
      }, delay * 1000);

      return () => {
        clearTimeout(timeout);
      };
    }

    return undefined;
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
