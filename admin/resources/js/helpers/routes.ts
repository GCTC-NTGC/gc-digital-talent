export const classificationTable = (): string => `/classifications`;
export const classificationCreate = (): string => `/classifications/create`;
export const classificationUpdate = (id: string): string =>
  `/classifications/${id}/edit`;

export const cmoAssetTable = (): string => `/cmo-assets`;
export const cmoAssetCreate = (): string => `/cmo-assets/create`;
export const cmoAssetUpdate = (id: string): string => `/cmo-assets/${id}/edit`;

export const operationalRequirementTable = (): string =>
  `/operational-requirements`;
export const operationalRequirementCreate = (): string =>
  `/operational-requirements/create`;
export const operationalRequirementUpdate = (id: string): string =>
  `/operational-requirements/${id}/edit`;

export const poolTable = (): string => `/pools`;
export const poolCreate = (): string => `/pools/create`;
export const poolUpdate = (id: string): string => `/pools/${id}/edit`;

export const poolCandidateTable = (poolId: string): string =>
  `/pools/${poolId}/pool-candidates`;
export const poolCandidateCreate = (poolId: string): string =>
  `/pools/${poolId}/pool-candidates/create`;
export const poolCandidateUpdate = (
  poolId: string,
  poolCandidateId: string,
): string => `/pools/${poolId}/pool-candidates/${poolCandidateId}/edit`;

export const userTable = (): string => `/users`;
export const userCreate = (): string => `/users/create`;
export const userUpdate = (id: string): string => `/users/${id}/edit`;
