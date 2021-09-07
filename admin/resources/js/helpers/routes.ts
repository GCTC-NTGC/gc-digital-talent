const appDir = process.env.APP_DIR ?? "admin";

export const classificationTablePath = (): string =>
  `/${appDir}/classifications`;
export const classificationCreatePath = (): string =>
  `/${appDir}/classifications/create`;
export const classificationUpdatePath = (id: string): string =>
  `/${appDir}/classifications/${id}/edit`;

export const cmoAssetTablePath = (): string => `/${appDir}/cmo-assets`;
export const cmoAssetCreatePath = (): string => `/${appDir}/cmo-assets/create`;
export const cmoAssetUpdatePath = (id: string): string =>
  `/${appDir}/cmo-assets/${id}/edit`;

export const operationalRequirementTablePath = (): string =>
  `/${appDir}/operational-requirements`;
export const operationalRequirementCreatePath = (): string =>
  `/${appDir}/operational-requirements/create`;
export const operationalRequirementUpdatePath = (id: string): string =>
  `/${appDir}/operational-requirements/${id}/edit`;

export const poolTablePath = (): string => `/${appDir}/pools`;
export const poolCreatePath = (): string => `/${appDir}/pools/create`;
export const poolUpdatePath = (id: string): string =>
  `/${appDir}/pools/${id}/edit`;

export const poolCandidateTablePath = (poolId: string): string =>
  `/${appDir}/pools/${poolId}/pool-candidates`;
export const poolCandidateCreatePath = (poolId: string): string =>
  `/${appDir}/pools/${poolId}/pool-candidates/create`;
export const poolCandidateUpdatePath = (
  poolId: string,
  poolCandidateId: string,
): string =>
  `/${appDir}/pools/${poolId}/pool-candidates/${poolCandidateId}/edit`;

export const userTablePath = (): string => `/${appDir}/users`;
export const userCreatePath = (): string => `/${appDir}/users/create`;
export const userUpdatePath = (id: string): string =>
  `/${appDir}/users/${id}/edit`;
