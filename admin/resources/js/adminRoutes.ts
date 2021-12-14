import path from "path-browserify";
import { Locales } from "@common/helpers/localize";
import ADMIN_APP_DIR from "./adminConstants";

export const homePath = (locale: Locales = "en"): string =>
  path.join("/", `/${locale}/${ADMIN_APP_DIR}`); // leading slash in case empty base url

export const classificationTablePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "classifications");
export const classificationCreatePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "classifications", "create");
export const classificationUpdatePath = (
  id: string,
  locale: Locales = "en",
): string => path.join(homePath(locale), "classifications", id, "edit");

export const cmoAssetTablePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "cmo-assets");
export const cmoAssetCreatePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "cmo-assets", "create");
export const cmoAssetUpdatePath = (
  id: string,
  locale: Locales = "en",
): string => path.join(homePath(locale), "cmo-assets", id, "edit");

export const departmentTablePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "departments");
export const departmentCreatePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "departments", "create");
export const departmentUpdatePath = (
  id: string,
  locale: Locales = "en",
): string => path.join(homePath(locale), "departments", id, "edit");

export const operationalRequirementTablePath = (
  locale: Locales = "en",
): string => path.join(homePath(locale), "operational-requirements");
export const operationalRequirementCreatePath = (
  locale: Locales = "en",
): string => path.join(homePath(locale), "operational-requirements", "create");
export const operationalRequirementUpdatePath = (
  id: string,
  locale: Locales = "en",
): string =>
  path.join(homePath(locale), "operational-requirements", id, "edit");

export const poolTablePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "pools");
export const poolCreatePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "pools", "create");
export const poolUpdatePath = (id: string, locale: Locales = "en"): string =>
  path.join(homePath(locale), "pools", id, "edit");

export const poolCandidateTablePath = (
  poolId: string,
  locale: Locales = "en",
): string => path.join(homePath(locale), "pools", poolId, "pool-candidates");
export const poolCandidateCreatePath = (
  poolId: string,
  locale: Locales = "en",
): string =>
  path.join(homePath(locale), "pools", poolId, "pool-candidates", "create");
export const poolCandidateUpdatePath = (
  poolId: string,
  poolCandidateId: string,
  locale: Locales = "en",
): string =>
  path.join(
    homePath(locale),
    "pools",
    poolId,
    "pool-candidates",
    poolCandidateId,
    "edit",
  );

export const userTablePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "users");
export const userCreatePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "users", "create");
export const userUpdatePath = (id: string, locale: Locales = "en"): string =>
  path.join(homePath(locale), "users", id, "edit");

export const searchRequestTablePath = (locale: Locales = "en"): string =>
  path.join(homePath(locale), "search-requests");
export const searchRequestUpdatePath = (
  id: string,
  locale: Locales = "en",
): string => path.join(homePath(locale), "search-requests", id, "edit");
