import { APP_DIR } from "./adminConstants";

export const homePath = (): string => `/${APP_DIR}`;
export const homePublicPath = (): string => `/${APP_DIR}/public/${APP_DIR}`;

export const classificationTablePath = (): string =>
  `/${APP_DIR}/classifications`;
export const classificationCreatePath = (): string =>
  `/${APP_DIR}/classifications/create`;
export const classificationUpdatePath = (id: string): string =>
  `/${APP_DIR}/classifications/${id}/edit`;

export const cmoAssetTablePath = (): string => `/${APP_DIR}/cmo-assets`;
export const cmoAssetCreatePath = (): string => `/${APP_DIR}/cmo-assets/create`;
export const cmoAssetUpdatePath = (id: string): string =>
  `/${APP_DIR}/cmo-assets/${id}/edit`;

export const departmentTablePath = (): string => `/${APP_DIR}/departments`;
export const departmentCreatePath = (): string =>
  `/${APP_DIR}/departments/create`;
export const departmentUpdatePath = (id: string): string =>
  `/${APP_DIR}/departments/${id}/edit`;

export const operationalRequirementTablePath = (): string =>
  `/${APP_DIR}/operational-requirements`;
export const operationalRequirementCreatePath = (): string =>
  `/${APP_DIR}/operational-requirements/create`;
export const operationalRequirementUpdatePath = (id: string): string =>
  `/${APP_DIR}/operational-requirements/${id}/edit`;

export const poolTablePath = (): string => `/${APP_DIR}/pools`;
export const poolCreatePath = (): string => `/${APP_DIR}/pools/create`;
export const poolUpdatePath = (id: string): string =>
  `/${APP_DIR}/pools/${id}/edit`;

export const poolCandidateTablePath = (poolId: string): string =>
  `/${APP_DIR}/pools/${poolId}/pool-candidates`;
export const poolCandidateCreatePath = (poolId: string): string =>
  `/${APP_DIR}/pools/${poolId}/pool-candidates/create`;
export const poolCandidateUpdatePath = (
  poolId: string,
  poolCandidateId: string,
): string =>
  `/${APP_DIR}/pools/${poolId}/pool-candidates/${poolCandidateId}/edit`;

export const userTablePath = (): string => `/${APP_DIR}/users`;
export const userCreatePath = (): string => `/${APP_DIR}/users/create`;
export const userUpdatePath = (id: string): string =>
  `/${APP_DIR}/users/${id}/edit`;
