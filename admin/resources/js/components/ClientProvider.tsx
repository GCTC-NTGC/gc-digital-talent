import React, { FunctionComponent } from "react";
import { Client, createClient, Provider } from "urql";

const apiUrl = process.env.API_URL ?? "http://localhost:8000/graphql";

export const defaultClient = createClient({
  url: apiUrl,
});

export const ClientProvider: FunctionComponent<{ client?: Client }> = ({
  client = defaultClient,
  children,
}) => {
  return <Provider value={client}>{children}</Provider>;
};

export default ClientProvider;
