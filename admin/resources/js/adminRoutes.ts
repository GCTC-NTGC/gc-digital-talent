import { Locales } from "@common/helpers/localize";
import { ADMIN_APP_DIR } from "./adminConstants";

export const basePath = (locale: Locales = "en"): string =>
  `/${locale}/${ADMIN_APP_DIR}`;
export const homePublicPath = (locale: Locales = "en"): string =>
  `/${ADMIN_APP_DIR}/public/${locale}/${ADMIN_APP_DIR}`;

export const classificationTablePath = (locale: Locales = "en"): string =>
  `${basePath(locale)}/classifications`;
export const classificationCreatePath = (locale: Locales = "en"): string =>
  `${basePath(locale)}/classifications/create`;
export const classificationUpdatePath = (
  id: string,
  locale: Locales = "en",
): string => `${basePath(locale)}/classifications/${id}/edit`;

export const cmoAssetTablePath = (locale: Locales = "en"): string =>
  `${basePath(locale)}/cmo-assets`;
export const cmoAssetCreatePath = (locale: Locales = "en"): string =>
  `${basePath(locale)}/cmo-assets/create`;
export const cmoAssetUpdatePath = (
  id: string,
  locale: Locales = "en",
): string => `${basePath(locale)}/cmo-assets/${id}/edit`;

export const departmentTablePath = (locale: Locales = "en"): string =>
  `${basePath(locale)}/departments`;
export const departmentCreatePath = (locale: Locales = "en"): string =>
  `${basePath(locale)}/departments/create`;
export const departmentUpdatePath = (
  id: string,
  locale: Locales = "en",
): string => `${basePath(locale)}/departments/${id}/edit`;

export const operationalRequirementTablePath = (
  locale: Locales = "en",
): string => `${basePath(locale)}/operational-requirements`;
export const operationalRequirementCreatePath = (
  locale: Locales = "en",
): string => `${basePath(locale)}/operational-requirements/create`;
export const operationalRequirementUpdatePath = (
  id: string,
  locale: Locales = "en",
): string => `${basePath(locale)}/operational-requirements/${id}/edit`;

export const poolTablePath = (locale: Locales = "en"): string =>
  `${basePath(locale)}/pools`;
export const poolCreatePath = (locale: Locales = "en"): string =>
  `${basePath(locale)}/pools/create`;
export const poolUpdatePath = (id: string, locale: Locales = "en"): string =>
  `${basePath(locale)}/pools/${id}/edit`;

export const poolCandidateTablePath = (
  poolId: string,
  locale: Locales = "en",
): string => `${basePath(locale)}/pools/${poolId}/pool-candidates`;
export const poolCandidateCreatePath = (
  poolId: string,
  locale: Locales = "en",
): string => `${basePath(locale)}/pools/${poolId}/pool-candidates/create`;
export const poolCandidateUpdatePath = (
  poolId: string,
  poolCandidateId: string,
  locale: Locales = "en",
): string =>
  `/${basePath(
    locale,
  )}/pools/${poolId}/pool-candidates/${poolCandidateId}/edit`;

export const userTablePath = (locale: Locales = "en"): string =>
  `${basePath(locale)}/users`;
export const userCreatePath = (locale: Locales = "en"): string =>
  `${basePath(locale)}/users/create`;
export const userUpdatePath = (id: string, locale: Locales = "en"): string =>
  `${basePath(locale)}/users/${id}/edit`;
