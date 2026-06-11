import { redirect } from "react-router";

import {
  getPathLocale,
  getDesiredLocale,
  STORED_LOCALE,
} from "@gc-digital-talent/i18n";

import type { Route } from "./+types/RootRoute";

const intlMiddleware: Route.ClientMiddlewareFunction = ({ request }, next) => {
  const url = new URL(request.url);

  const currentPathLocale = getPathLocale(url.pathname);

  if (!currentPathLocale) {
    const targetLocale = getDesiredLocale();
    const newPath = `/${targetLocale}${url.pathname}${url.search}`;

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(newPath);
  }

  localStorage.setItem(STORED_LOCALE, currentPathLocale);

  return next();
};

export default intlMiddleware;
