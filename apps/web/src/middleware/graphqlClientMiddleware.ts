import { createContext, MiddlewareFunction } from "react-router";
import { Client } from "urql";

import { getClient } from "@gc-digital-talent/client";

import { intlContext } from "./intlMiddleware";

export const graphqlClientContext = createContext<Client>();

const graphqlClientMiddleware: MiddlewareFunction = ({ context }) => {
  const intl = context.get(intlContext);
  const client = getClient(intl);
  context.set(graphqlClientContext, client);
};

export default graphqlClientMiddleware;
