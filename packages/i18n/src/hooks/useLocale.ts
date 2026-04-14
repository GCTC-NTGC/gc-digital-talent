import { useLocation } from "react-router";

import type { Locales } from "../types";

function useLocale(): Locales {
  const location = useLocation();
  const pathLocale = location.pathname.split("/")[1];
  return pathLocale === "fr" ? "fr" : "en";
}

export default useLocale;
