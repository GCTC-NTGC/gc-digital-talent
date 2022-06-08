import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";

export type AuthRoutes = ReturnType<typeof authRoutes>;

const authRoutes = (lang: string) => {
  const home = (): string => path.join("/", lang);

  return {
    login: (): string => path.join(home(), "login-info"),
    register: (): string => path.join(home(), "register"),
    loggedOut: (): string => path.join(home(), "logged-out"),
  };
};

export const useAuthRoutes = (): AuthRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return authRoutes(locale);
};

export default authRoutes;
