import React, { useContext, useMemo } from "react";
import {
  Client,
  CombinedError,
  createClient,
  defaultExchanges,
  errorExchange,
  Provider,
} from "urql";
import { ErrorContext } from "./ErrorContainer";

const apiUrl = process.env.API_URL ?? "http://localhost:8000/graphql";

export const ClientProvider: React.FC<{ client?: Client }> = ({
  client,
  children,
}) => {
  const { dispatch } = useContext(ErrorContext);

  const internalClient = useMemo(() => {
    return (
      client ??
      createClient({
        url: apiUrl,
        exchanges: [
          errorExchange({
            onError: (error: CombinedError) => {
              dispatch({
                type: "push",
                payload: error.message,
              });
            },
          }),
          ...defaultExchanges,
        ],
      })
    );
  }, [client, dispatch]);

  return <Provider value={internalClient}>{children}</Provider>;
};

export default ClientProvider;
