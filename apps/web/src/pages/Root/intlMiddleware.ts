import { redirect } from "react-router";

import { getDesiredLocale, getIntl } from "@gc-digital-talent/i18n";

import messages from "~/lang/frCompiled.json";
import { intlContext } from "~/middleware/context";

import type { Route } from "./+types/RootRoute";

const intlMiddleware: Route.ClientMiddlewareFunction = (
  { context, request },
  next,
) => {
  const url = new URL(request.url);

  if (url.pathname === "/") {
    const locale = getDesiredLocale() || "en";
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(`/${locale}`);
  }

  const intl = getIntl(messages);
  context.set(intlContext, intl);
  return next();
};

export default intlMiddleware;
