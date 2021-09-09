import React, { useContext, useEffect, useMemo } from "react";
import {
  Client,
  CombinedError,
  createClient,
  defaultExchanges,
  errorExchange,
  Provider,
} from "urql";
import {
  parseUrlQueryParameters,
  redirect,
  useLocation,
} from "../helpers/router";
import { ErrorContext } from "./ErrorContainer";

const apiUri = process.env.API_URI ?? "http://localhost:8000/graphql";

export const ClientProvider: React.FC<{ client?: Client }> = ({
  client,
  children,
}) => {
  const { dispatch } = useContext(ErrorContext);
  const location = useLocation();
  useEffect(() => {
    const queryParams = parseUrlQueryParameters(location);
    const accessToken = queryParams.access_token;
    if (accessToken && queryParams.token_type === "Bearer") {
      localStorage.setItem("access_token", accessToken);
      redirect({
        ...location,
        search: "",
      });
    }
  }, [location]);

  const internalClient = useMemo(() => {
    return (
      client ??
      createClient({
        url: apiUri,
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
