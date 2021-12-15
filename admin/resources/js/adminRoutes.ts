import path from "path-browserify";
import { Locales } from "@common/helpers/localize";
import ADMIN_APP_DIR from "./adminConstants";

export const homePath = (lang: string): string =>
  path.join("/", `/${lang}/${ADMIN_APP_DIR}`); // leading slash in case empty base url

export const classificationTablePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "classifications");
export const classificationCreatePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "classifications", "create");
export const classificationUpdatePath = (id: string, lang: string): string =>
  path.join(homePath(lang as Locales), "classifications", id, "edit");

export const cmoAssetTablePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "cmo-assets");
export const cmoAssetCreatePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "cmo-assets", "create");
export const cmoAssetUpdatePath = (id: string, lang: string): string =>
  path.join(homePath(lang as Locales), "cmo-assets", id, "edit");

export const departmentTablePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "departments");
export const departmentCreatePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "departments", "create");
export const departmentUpdatePath = (id: string, lang: string): string =>
  path.join(homePath(lang as Locales), "departments", id, "edit");

export const operationalRequirementTablePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "operational-requirements");
export const operationalRequirementCreatePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "operational-requirements", "create");
export const operationalRequirementUpdatePath = (
  id: string,
  lang: string,
): string =>
  path.join(homePath(lang as Locales), "operational-requirements", id, "edit");

export const poolTablePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "pools");
export const poolCreatePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "pools", "create");
export const poolUpdatePath = (id: string, lang: string): string =>
  path.join(homePath(lang as Locales), "pools", id, "edit");

export const poolCandidateTablePath = (poolId: string, lang: string): string =>
  path.join(homePath(lang as Locales), "pools", poolId, "pool-candidates");
export const poolCandidateCreatePath = (poolId: string, lang: string): string =>
  path.join(
    homePath(lang as Locales),
    "pools",
    poolId,
    "pool-candidates",
    "create",
  );
export const poolCandidateUpdatePath = (
  poolId: string,
  poolCandidateId: string,
  lang: string,
): string =>
  path.join(
    homePath(lang as Locales),
    "pools",
    poolId,
    "pool-candidates",
    poolCandidateId,
    "edit",
  );

export const userTablePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "users");
export const userCreatePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "users", "create");
export const userUpdatePath = (id: string, lang: string): string =>
  path.join(homePath(lang as Locales), "users", id, "edit");

export const searchRequestTablePath = (lang: string): string =>
  path.join(homePath(lang as Locales), "search-requests");
export const searchRequestUpdatePath = (id: string, lang: string): string =>
  path.join(homePath(lang as Locales), "search-requests", id, "edit");
