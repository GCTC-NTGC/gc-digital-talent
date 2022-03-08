import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import { ADMIN_APP_DIR } from "./adminConstants";

export type AdminRoutes = ReturnType<typeof adminRoutes>;

const adminRoutes = (lang: string) => {
  const unlocalizedRoot = (): string => path.join("/", ADMIN_APP_DIR); // leading slash in case empty base url
  const home = (): string => path.join("/", lang, ADMIN_APP_DIR); // leading slash in case empty base url
  return {
    home,
    refreshAccessToken: (): string => path.join(unlocalizedRoot(), "refresh"),

    classificationTable: (): string => path.join(home(), "classifications"),
    classificationCreate: (): string =>
      path.join(home(), "classifications", "create"),
    classificationUpdate: (id: string): string =>
      path.join(home(), "classifications", id, "edit"),

    cmoAssetTable: (): string => path.join(home(), "cmo-assets"),
    cmoAssetCreate: (): string => path.join(home(), "cmo-assets", "create"),
    cmoAssetUpdate: (id: string): string =>
      path.join(home(), "cmo-assets", id, "edit"),

    departmentTable: (): string => path.join(home(), "departments"),
    departmentCreate: (): string => path.join(home(), "departments", "create"),
    departmentUpdate: (id: string): string =>
      path.join(home(), "departments", id, "edit"),

    skillFamilyTable: (): string => path.join(home(), "skill-families"),
    skillFamilyCreate: (): string =>
      path.join(home(), "skill-families", "create"),
    skillFamilyUpdate: (id: string): string =>
      path.join(home(), "skill-families", id, "edit"),
    skillTable: (): string => path.join(home(), "skills"),
    skillCreate: (): string => path.join(home(), "skills", "create"),
    skillUpdate: (id: string): string =>
      path.join(home(), "skills", id, "edit"),

    operationalRequirementTable: (): string =>
      path.join(home(), "operational-requirements"),
    operationalRequirementCreate: (): string =>
      path.join(home(), "operational-requirements", "create"),
    operationalRequirementUpdate: (id: string): string =>
      path.join(home(), "operational-requirements", id, "edit"),

    poolTable: (): string => path.join(home(), "pools"),
    poolCreate: (): string => path.join(home(), "pools", "create"),
    poolUpdate: (id: string): string => path.join(home(), "pools", id, "edit"),

    poolCandidateTable: (poolId: string): string =>
      path.join(home(), "pools", poolId, "pool-candidates"),
    poolCandidateCreate: (poolId: string): string =>
      path.join(home(), "pools", poolId, "pool-candidates", "create"),
    poolCandidateUpdate: (poolId: string, poolCandidateId: string): string =>
      path.join(
        home(),
        "pools",
        poolId,
        "pool-candidates",
        poolCandidateId,
        "edit",
      ),

    userTable: (): string => path.join(home(), "users"),
    userCreate: (): string => path.join(home(), "users", "create"),
    userUpdate: (id: string): string => path.join(home(), "users", id, "edit"),

    searchRequestTable: (): string => path.join(home(), "search-requests"),
    searchRequestUpdate: (id: string): string =>
      path.join(home(), "search-requests", id, "edit"),
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
