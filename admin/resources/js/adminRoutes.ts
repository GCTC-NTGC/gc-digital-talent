import { ADMIN_APP_DIR } from "./adminConstants";

export const homePath = (): string => `/${ADMIN_APP_DIR}`;
export const homePublicPath = (): string => `/${ADMIN_APP_DIR}/public/${ADMIN_APP_DIR}`;

export const classificationTablePath = (): string =>
  `/${ADMIN_APP_DIR}/classifications`;
export const classificationCreatePath = (): string =>
  `/${ADMIN_APP_DIR}/classifications/create`;
export const classificationUpdatePath = (id: string): string =>
  `/${ADMIN_APP_DIR}/classifications/${id}/edit`;

export const cmoAssetTablePath = (): string => `/${ADMIN_APP_DIR}/cmo-assets`;
export const cmoAssetCreatePath = (): string => `/${ADMIN_APP_DIR}/cmo-assets/create`;
export const cmoAssetUpdatePath = (id: string): string =>
  `/${ADMIN_APP_DIR}/cmo-assets/${id}/edit`;

export const departmentTablePath = (): string => `/${ADMIN_APP_DIR}/departments`;
export const departmentCreatePath = (): string =>
  `/${ADMIN_APP_DIR}/departments/create`;
export const departmentUpdatePath = (id: string): string =>
  `/${ADMIN_APP_DIR}/departments/${id}/edit`;

export const operationalRequirementTablePath = (): string =>
  `/${ADMIN_APP_DIR}/operational-requirements`;
export const operationalRequirementCreatePath = (): string =>
  `/${ADMIN_APP_DIR}/operational-requirements/create`;
export const operationalRequirementUpdatePath = (id: string): string =>
  `/${ADMIN_APP_DIR}/operational-requirements/${id}/edit`;

export const poolTablePath = (): string => `/${ADMIN_APP_DIR}/pools`;
export const poolCreatePath = (): string => `/${ADMIN_APP_DIR}/pools/create`;
export const poolUpdatePath = (id: string): string =>
  `/${ADMIN_APP_DIR}/pools/${id}/edit`;

export const poolCandidateTablePath = (poolId: string): string =>
  `/${ADMIN_APP_DIR}/pools/${poolId}/pool-candidates`;
export const poolCandidateCreatePath = (poolId: string): string =>
  `/${ADMIN_APP_DIR}/pools/${poolId}/pool-candidates/create`;
export const poolCandidateUpdatePath = (
  poolId: string,
  poolCandidateId: string,
): string =>
  `/${ADMIN_APP_DIR}/pools/${poolId}/pool-candidates/${poolCandidateId}/edit`;

export const userTablePath = (): string => `/${ADMIN_APP_DIR}/users`;
export const userCreatePath = (): string => `/${ADMIN_APP_DIR}/users/create`;
export const userUpdatePath = (id: string): string =>
  `/${ADMIN_APP_DIR}/users/${id}/edit`;
