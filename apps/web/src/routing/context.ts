import { createContext } from "react-router";
import { type Client } from "urql";
import { type IntlShape } from "react-intl";

import { type Maybe, type UserAuthInfo } from "@gc-digital-talent/graphql";

export type GraphqlClientContext = Client;

export const graphqlClientContext = createContext<Client>();

export type UserContext = Maybe<Partial<UserAuthInfo>>;

export const userContext = createContext<UserContext>(null);

export type IntlContext = IntlShape;

export const intlContext = createContext<IntlContext>();

export interface AppContext {
  get(token: typeof userContext): UserContext;
  get(token: typeof intlContext): IntlContext;
  get(token: typeof graphqlClientContext): GraphqlClientContext;
}
