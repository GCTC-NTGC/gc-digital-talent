export const classificationTablePath = (): string => `/classifications`;
export const classificationCreatePath = (): string => `/classifications/create`;
export const classificationUpdatePath = (id: string): string =>
  `/classifications/${id}/edit`;

export const cmoAssetTablePath = (): string => `/cmo-assets`;
export const cmoAssetCreatePath = (): string => `/cmo-assets/create`;
export const cmoAssetUpdatePath = (id: string): string =>
  `/cmo-assets/${id}/edit`;

export const operationalRequirementTablePath = (): string =>
  `/operational-requirements`;
export const operationalRequirementCreatePath = (): string =>
  `/operational-requirements/create`;
export const operationalRequirementUpdatePath = (id: string): string =>
  `/operational-requirements/${id}/edit`;

export const poolTablePath = (): string => `/pools`;
export const poolCreatePath = (): string => `/pools/create`;
export const poolUpdatePath = (id: string): string => `/pools/${id}/edit`;

export const poolCandidateTablePath = (poolId: string): string =>
  `/pools/${poolId}/pool-candidates`;
export const poolCandidateCreatePath = (poolId: string): string =>
  `/pools/${poolId}/pool-candidates/create`;
export const poolCandidateUpdatePath = (
  poolId: number,
  poolCandidateId: number,
): string => `/pools/${poolId}/pool-candidates/${poolCandidateId}/edit`;

export const userTablePath = (): string => `/users`;
export const userCreatePath = (): string => `/users/create`;
export const userUpdatePath = (id: string): string => `/users/${id}/edit`;
