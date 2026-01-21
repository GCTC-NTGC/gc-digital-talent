import { createContext } from "react-router";
import { Client } from "urql";
import { IntlShape } from "react-intl";

import { Maybe, UserAuthInfo } from "@gc-digital-talent/graphql";

export type GraphqlClientContext = Client | null;

export const graphqlClientContext = createContext<GraphqlClientContext>(null);

export type UserContext = Maybe<Partial<UserAuthInfo>>;

export const userContext = createContext<UserContext>(null);

export type IntlContext = IntlShape | null;

export const intlContext = createContext<IntlContext>(null);

export interface AppContext {
  get(token: typeof userContext): UserContext;
  get(token: typeof intlContext): IntlContext;
  get(token: typeof graphqlClientContext): GraphqlClientContext;
}
