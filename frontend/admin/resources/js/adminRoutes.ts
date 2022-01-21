import path from "path-browserify";
import ADMIN_APP_DIR from "./adminConstants";

export const homePath = (): string => path.join("/", ADMIN_APP_DIR); // leading slash in case empty base url

export const classificationTablePath = (): string =>
  path.join(homePath(), "classifications");
export const classificationCreatePath = (): string =>
  path.join(homePath(), "classifications", "create");
export const classificationUpdatePath = (id: string): string =>
  path.join(homePath(), "classifications", id, "edit");

export const cmoAssetTablePath = (): string =>
  path.join(homePath(), "cmo-assets");
export const cmoAssetCreatePath = (): string =>
  path.join(homePath(), "cmo-assets", "create");
export const cmoAssetUpdatePath = (id: string): string =>
  path.join(homePath(), "cmo-assets", id, "edit");

export const departmentTablePath = (): string =>
  path.join(homePath(), "departments");
export const departmentCreatePath = (): string =>
  path.join(homePath(), "departments", "create");
export const departmentUpdatePath = (id: string): string =>
  path.join(homePath(), "departments", id, "edit");

export const operationalRequirementTablePath = (): string =>
  path.join(homePath(), "operational-requirements");
export const operationalRequirementCreatePath = (): string =>
  path.join(homePath(), "operational-requirements", "create");
export const operationalRequirementUpdatePath = (id: string): string =>
  path.join(homePath(), "operational-requirements", id, "edit");

export const poolTablePath = (): string => path.join(homePath(), "pools");
export const poolCreatePath = (): string =>
  path.join(homePath(), "pools", "create");
export const poolUpdatePath = (id: string): string =>
  path.join(homePath(), "pools", id, "edit");

export const poolCandidateTablePath = (poolId: string): string =>
  path.join(homePath(), "pools", poolId, "pool-candidates");
export const poolCandidateCreatePath = (poolId: string): string =>
  path.join(homePath(), "pools", poolId, "pool-candidates", "create");
export const poolCandidateUpdatePath = (
  poolId: string,
  poolCandidateId: string,
): string =>
  path.join(
    homePath(),
    "pools",
    poolId,
    "pool-candidates",
    poolCandidateId,
    "edit",
  );

export const userTablePath = (): string => path.join(homePath(), "users");
export const userCreatePath = (): string =>
  path.join(homePath(), "users", "create");
export const userUpdatePath = (id: string): string =>
  path.join(homePath(), "users", id, "edit");

export const searchRequestTablePath = (): string =>
  path.join(homePath(), "search-requests");
export const searchRequestUpdatePath = (id: string): string =>
  path.join(homePath(), "search-requests", id, "edit");
