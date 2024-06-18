interface ApiRoutes {
  login: (from?: string, locale?: string) => string;
  refreshAccessToken: () => string;
}

const isDevServer =
  typeof IS_DEV_SERVER !== "undefined" ? IS_DEV_SERVER : false;

const apiHost =
  typeof API_HOST !== "undefined" ? API_HOST : "http://localhost:8000";

const apiRoutes = {
  login: (from?: string, locale?: string): string => {
    const searchTerms: string[] = [];
    if (from) searchTerms.push(`from=${encodeURI(from)}`);
    if (locale) searchTerms.push(`locale=${encodeURI(locale)}`);
    if (isDevServer) searchTerms.push(`devServer=${encodeURI("true")}`);
    const searchString = searchTerms.join("&");

    const loginPath = `login${searchString ? `?${searchString}` : ""}`;

    const url = new URL(loginPath, apiHost);

    return url.toString();
  },
  refreshAccessToken: (): string => new URL("refresh", apiHost).toString(),
};

export default apiRoutes;

/**
 * A hook version of loginRoutes which gets the locale from the intl context.
 * @returns LoginRoutes
 */
export const useApiRoutes = (): ApiRoutes => {
  return apiRoutes;
};
