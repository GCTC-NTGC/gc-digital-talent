import { redirect } from "react-router";

import { getIntl, getPathLocale, getDesiredLocale, STORED_LOCALE } from "@gc-digital-talent/i18n";

import messages from "~/lang/frCompiled.json";
import { intlContext } from "~/routing/context";

import type { Route } from "./+types/RootRoute";

const intl = getIntl(messages);

const intlMiddleware: Route.ClientMiddlewareFunction = (
  { context, request },
  next,
) => {
  const url = new URL(request.url);

  const currentPathLocale = getPathLocale(url.pathname);

  if (!currentPathLocale) {
    const targetLocale = getDesiredLocale();
    const newPath = `/${targetLocale}${url.pathname}${url.search}`;

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(newPath);
  }

  localStorage.setItem(STORED_LOCALE, currentPathLocale);

  context.set(intlContext, intl);
  return next();
};

export default intlMiddleware;
