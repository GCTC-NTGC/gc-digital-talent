import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { localeRedirect } from "../helpers/localize";
import useLocale from "./useLocale";

const useLocaleRedirect = () => {
  const { locale } = useLocale();
  const { locale: localeParam } = useParams();

  useEffect(() => {
    if (!localeParam || localeParam !== locale) {
      localeRedirect(locale);
    }
  }, [locale, localeParam]);
};

export default useLocaleRedirect;
