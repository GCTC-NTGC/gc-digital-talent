import React, { useMemo } from "react";
import {
  Client,
  CombinedError,
  createClient,
  defaultExchanges,
  errorExchange,
  Provider,
} from "urql";
import { toast } from "react-toastify";

const apiUri = process.env.API_URI ?? "http://localhost:8000/graphql";

export const ClientProvider: React.FC<{ client?: Client }> = ({
  client,
  children,
}) => {
  const internalClient = useMemo(() => {
    return (
      client ??
      createClient({
        url: apiUri,
        exchanges: [
          errorExchange({
            onError: (error: CombinedError) => {
              toast.error(error.message);
            },
          }),
          ...defaultExchanges,
        ],
      })
    );
  }, [client]);

  return <Provider value={internalClient}>{children}</Provider>;
};

export default ClientProvider;
