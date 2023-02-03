import path from "path-browserify";

import useLocale from "./useLocale";
import { Locales } from "../helpers/localize";

const getRoutes = (lang: Locales) => {
  const baseUrl = path.join("/", lang);

  return {
    // Main Routes
    home: () => baseUrl,
    notFound: () => path.join(baseUrl, "404"),
    register: () => path.join(baseUrl, "register-info"),
    login: () => path.join(baseUrl, "login-info"),
    loggedOut: () => path.join(baseUrl, "logged-out"),
  };
};

const useRoutes = () => {
  const { locale } = useLocale();

  return getRoutes(locale);
};

export default useRoutes;
