interface ApiRoutes {
  login: (from?: string, locale?: string) => string;
  refreshAccessToken: () => string;
}

const apiHost = (): string => "http://localhost:8001";

const apiRoutes = {
  login: (from?: string, locale?: string): string => {
    const searchTerms: string[] = [];
    if (from) searchTerms.push(`from=${encodeURI(from)}`);
    if (locale) searchTerms.push(`locale=${encodeURI(locale)}`);
    const searchString = searchTerms.join("&");

    // eslint-disable-next-line prefer-template
    const loginPath = "login" + (searchString ? `?${searchString}` : "");

    const url = new URL(loginPath, apiHost());

    return url.toString();
  },
  refreshAccessToken: (): string => new URL("refresh", apiHost()).toString(),
};

export default apiRoutes;

/**
 * A hook version of loginRoutes which gets the locale from the intl context.
 * @returns LoginRoutes
 */
export const useApiRoutes = (): ApiRoutes => {
  return apiRoutes;
};
