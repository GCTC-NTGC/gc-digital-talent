import { createContext, MiddlewareFunction } from "react-router";
import { Client } from "urql";

import { getClient } from "@gc-digital-talent/client";

import { intlContext } from "./intlMiddleware";

export const clientContext = createContext<Client>();

const clientMiddleware: MiddlewareFunction = ({ context }) => {
  const intl = context.get(intlContext);
  const client = getClient({ intl });
  context.set(clientContext, client);
};

export default clientMiddleware;
