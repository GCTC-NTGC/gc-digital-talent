export const classificationTable = (locale: string): string =>
  `/classifications`;
export const classificationCreate = (locale: string): string =>
  `/classifications/create`;
export const classificationUpdate = (locale: string, id: string): string =>
  `/classifications/${id}/edit`;

export const cmoAssetTable = (locale: string): string => `/cmoAssets`;
export const cmoAssetCreate = (locale: string): string => `/cmoAssets/create`;
export const cmoAssetUpdate = (locale: string, id: string): string =>
  `/cmoAssets/${id}/edit`;

export const operationalRequirementTable = (locale: string): string =>
  `/operationalRequirements`;
export const operationalRequirementCreate = (locale: string): string =>
  `/operationalRequirements/create`;
export const operationalRequirementUpdate = (
  locale: string,
  id: string,
): string => `/operationalRequirements/${id}/edit`;

export const poolTable = (locale: string): string => `/pools`;
export const poolCreate = (locale: string): string => `/pools/create`;
export const poolUpdate = (locale: string, id: string): string =>
  `/pools/${id}/edit`;

export const poolCandidateTable = (locale: string): string => `/poolCandidates`;
export const poolCandidateCreate = (locale: string): string =>
  `/poolCandidates/create`;
export const poolCandidateUpdate = (locale: string, id: string): string =>
  `/poolCandidates/${id}/edit`;

export const userTable = (locale: string): string => `/users`;
export const userCreate = (locale: string): string => `/users/create`;
export const userUpdate = (locale: string, id: string): string =>
  `/users/${id}/edit`;
