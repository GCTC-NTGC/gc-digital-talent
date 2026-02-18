import { redirect } from "react-router";

import { getDesiredLocale, getIntl } from "@gc-digital-talent/i18n";

import messages from "~/lang/frCompiled.json";
import { intlContext } from "~/routing/context";

import type { Route } from "./+types/RootRoute";

const intl = getIntl(messages);
const SUPPORTED_LOCALES = ["en", "fr"];

const intlMiddleware: Route.ClientMiddlewareFunction = (
  { context, request },
  next,
) => {
  const url = new URL(request.url);
  const { pathname, search } = url;

  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  const hasValidLocale = SUPPORTED_LOCALES.includes(firstSegment);

  if (!hasValidLocale) {
    const locale = getDesiredLocale() || "en";

    const newPath = `/${locale}${pathname}${search}`;

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(newPath);
  }

  context.set(intlContext, intl);
  return next();
};

export default intlMiddleware;
