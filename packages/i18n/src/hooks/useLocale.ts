import { useLocation } from "react-router";

import { Locales } from "../types";

function useLocale(): Locales {
  const location = useLocation();
  const pathLocale = location.pathname.split("/")[1];
  return pathLocale === "fr" ? "fr" : "en";
}

export default useLocale;
