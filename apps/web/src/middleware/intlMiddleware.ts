import { IntlShape } from "react-intl";
import { createContext, MiddlewareFunction } from "react-router";

import { getIntl } from "@gc-digital-talent/i18n";

import messages from "~/lang/frCompiled.json";

export type IntlContext = IntlShape;

export const intlContext = createContext<IntlContext>();

const intlMiddleware: MiddlewareFunction = ({ context }) => {
  const intl = getIntl(messages);
  context.set(intlContext, intl);
};

export default intlMiddleware;
