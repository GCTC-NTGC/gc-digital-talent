import path from "path-browserify";

export type ApiRoutes = ReturnType<typeof apiRoutes>;

const apiRoutes = () => {
  const apiRoot = (): string => "/";
  return {
    login: (from?: string, locale?: string): string => {
      const searchTerms: string[] = [];
      if (from) searchTerms.push(`from=${encodeURI(from)}`);
      if (locale) searchTerms.push(`locale=${encodeURI(locale)}`);
      const searchString = searchTerms.join("&");

      const url =
        path.join(apiRoot(), "login") +
        (searchString ? `?${searchString}` : "");

      return url;
    },
    refreshAccessToken: (): string => path.join(apiRoot(), "refresh"),
  };
};

export default apiRoutes;

/**
 * A hook version of loginRoutes which gets the locale from the intl context.
 * @returns LoginRoutes
 */
export const useApiRoutes = (): ApiRoutes => {
  return apiRoutes();
};
