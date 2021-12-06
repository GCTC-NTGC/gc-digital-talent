import path from "path-browserify";
import { ADMIN_APP_DIR } from "./adminConstants";

export const homePath = (): string => path.join("/", ADMIN_APP_DIR); // leading slash in case empty base url
export const homePublicPath = (): string =>
  path.join("/", ADMIN_APP_DIR, "public");

export const classificationTablePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "classifications");
export const classificationCreatePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "classifications", "create");
export const classificationUpdatePath = (id: string): string =>
  path.join("/", ADMIN_APP_DIR, "classifications", id, "edit");

export const cmoAssetTablePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "cmo-assets");
export const cmoAssetCreatePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "cmo-assets", "create");
export const cmoAssetUpdatePath = (id: string): string =>
  path.join("/", ADMIN_APP_DIR, "cmo-assets", id, "edit");

export const departmentTablePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "departments");
export const departmentCreatePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "departments", "create");
export const departmentUpdatePath = (id: string): string =>
  path.join("/", ADMIN_APP_DIR, "departments", id, "edit");

export const operationalRequirementTablePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "operational-requirements");
export const operationalRequirementCreatePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "operational-requirements", "create");
export const operationalRequirementUpdatePath = (id: string): string =>
  path.join("/", ADMIN_APP_DIR, "operational-requirements", id, "edit");

export const poolTablePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "pools");
export const poolCreatePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "pools", "create");
export const poolUpdatePath = (id: string): string =>
  path.join("/", ADMIN_APP_DIR, "pools", id, "edit");

export const poolCandidateTablePath = (poolId: string): string =>
  path.join("/", ADMIN_APP_DIR, "pools", poolId, "pool-candidates");
export const poolCandidateCreatePath = (poolId: string): string =>
  path.join("/", ADMIN_APP_DIR, "pools", poolId, "pool-candidates", "create");
export const poolCandidateUpdatePath = (
  poolId: string,
  poolCandidateId: string,
): string =>
  path.join(
    "/",
    ADMIN_APP_DIR,
    "pools",
    poolId,
    "pool-candidates",
    poolCandidateId,
    "edit",
  );

export const userTablePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "users");
export const userCreatePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "users", "create");
export const userUpdatePath = (id: string): string =>
  path.join("/", ADMIN_APP_DIR, "users", id, "edit");

export const searchRequestTablePath = (): string =>
  path.join("/", ADMIN_APP_DIR, "search-requests");
export const searchRequestUpdatePath = (id: string): string =>
  path.join("/", ADMIN_APP_DIR, "search-requests", id, "edit");
