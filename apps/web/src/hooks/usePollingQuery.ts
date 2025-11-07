import { useEffect } from "react";
import { AnyVariables, UseQueryArgs, useQuery } from "urql";

import useDocumentHasFocus from "./useDocumentHasFocus";

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
  const documentHasFocus = useDocumentHasFocus();

  useEffect(() => {
    // Do nothing if we are already fetching
    if (!result.fetching && !disabled && documentHasFocus) {
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
    documentHasFocus,
  ]);

  return [result, executeQuery];
};

export default usePollingQuery;
