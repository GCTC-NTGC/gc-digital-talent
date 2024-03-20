import { useEffect } from "react";
import { AnyVariables, UseQueryArgs, useQuery } from "urql";

type QueryArgs<TData, TVariables extends AnyVariables> = UseQueryArgs<
  TVariables,
  TData
>;

const usePollingQuery = <TData, TVariables extends AnyVariables>(
  queryArgs: QueryArgs<TData, TVariables>,
  delay: number,
) => {
  const [result, executeQuery] = useQuery<TData, TVariables>(queryArgs);

  useEffect(() => {
    // Do nothing if we are already fetching
    if (!result.fetching) {
      const timeout = setTimeout(() => {
        executeQuery({ requestPolicy: "network-only" });
      }, delay * 1000);

      return () => {
        clearTimeout(timeout);
      };
    }

    return undefined;
  }, [result.fetching, executeQuery, queryArgs.variables, delay]);

  return [result];
};

export default usePollingQuery;
