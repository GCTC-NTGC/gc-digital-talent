import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import { ADMIN_APP_DIR } from "./adminConstants";

export type AdminRoutes = ReturnType<typeof adminRoutes>;

const adminRoutes = (lang: string) => {
  const home = (): string => path.join("/", lang, ADMIN_APP_DIR); // leading slash in case empty base url
  return {
    home,

    dashboard: (): string => path.join(home(), "dashboard"),

    cmoAssetTable: (): string => path.join(home(), "cmo-assets"),
    cmoAssetCreate: (): string => path.join(home(), "cmo-assets", "create"),
    cmoAssetUpdate: (id: string): string =>
      path.join(home(), "cmo-assets", id, "edit"),

    poolTable: (): string => path.join(home(), "pools"),
    poolCreate: (): string => path.join(home(), "pools", "create"),
    poolEdit: (id: string): string => path.join(home(), "pools", id, "edit"),
    poolView: (id: string): string => path.join(home(), "pools", id),

    poolCandidateTable: (poolId: string): string =>
      path.join(home(), "pools", poolId, "pool-candidates"),
    candidateProfile: (): string => path.join(home(), "candidate-profile"),

    userTable: (): string => path.join(home(), "users"),
    userCreate: (): string => path.join(home(), "users", "create"),
    userUpdate: (id: string): string => path.join(home(), "users", id, "edit"),
    userView: (id: string): string => path.join(home(), "users", id),

    searchRequestTable: (): string => path.join(home(), "talent-requests"),
    searchRequestView: (id: string): string =>
      path.join(home(), "talent-requests", id),

    classificationTable: (): string =>
      path.join(home(), "settings", "classifications"),
    classificationCreate: (): string =>
      path.join(home(), "settings", "classifications", "create"),
    classificationUpdate: (id: string): string =>
      path.join(home(), "settings", "classifications", id, "edit"),

    skillTable: (): string => path.join(home(), "settings", "skills"),
    skillCreate: (): string =>
      path.join(home(), "settings", "skills", "create"),
    skillUpdate: (id: string): string =>
      path.join(home(), "settings", "skills", id, "edit"),
    skillFamilyTable: (): string =>
      path.join(home(), "settings", "skills", "families"),
    skillFamilyCreate: (): string =>
      path.join(home(), "settings", "skills", "families", "create"),
    skillFamilyUpdate: (id: string): string =>
      path.join(home(), "settings", "skills", "families", id, "edit"),

    departmentTable: (): string => path.join(home(), "settings", "departments"),
    departmentCreate: (): string =>
      path.join(home(), "settings", "departments", "create"),
    departmentUpdate: (id: string): string =>
      path.join(home(), "settings", "departments", id, "edit"),
  };
};

export default adminRoutes;

/**
 * A hook version of adminRoutes which gets the locale from the intl context.
 * @returns AdminRoutes
 */
export const useAdminRoutes = (): AdminRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return adminRoutes(locale);
};
