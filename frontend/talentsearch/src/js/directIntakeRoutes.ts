import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import { DIRECTINTAKE_APP_DIR } from "./talentSearchConstants";

export type DirectIntakeRoutes = ReturnType<typeof directIntakeRoutes>;

const directIntakeRoutes = (lang: string) => {
  const home = (): string => path.join("/", lang, DIRECTINTAKE_APP_DIR);

  return {
    home,
    pool: (id: string) => path.join(home(), "pools", id),
    poolApply: (id: string) => path.join(home(), "pools", id, "apply"),
  };
};

export const useDirectIntakeRoutes = (): DirectIntakeRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return directIntakeRoutes(locale);
};

export default directIntakeRoutes;
