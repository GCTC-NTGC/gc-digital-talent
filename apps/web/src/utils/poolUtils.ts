import { SimpleClassification, SimplePool } from "~/types/pool";
import {
  AdvertisementStatus,
  Maybe,
  PoolCandidate,
  Role,
  Scalars,
} from "~/api/generated";

/**
 * Check if a pool matches a
 * classification
 *
 * @param pool
 * @param classification
 * @returns boolean
 */
export const poolMatchesClassification = (
  pool: SimplePool,
  classification: SimpleClassification,
): boolean => {
  return (
    pool.classifications?.some(
      (poolClassification) =>
        poolClassification?.group === classification?.group &&
        poolClassification?.level === classification?.level,
    ) ?? false
  );
};

/**
 * Determine if the advertisement can be
 * viewed based on user roles and status
 *
 * @param roles
 * @param status
 * @returns boolean
 */
export const isAdvertisementVisible = (
  roles: Maybe<Role>[],
  status?: Maybe<AdvertisementStatus>,
) => {
  let visible = roles.includes(Role.Admin) ?? false;
  if (status !== AdvertisementStatus.Draft) {
    visible = true;
  }

  return visible;
};

/**
 * See if the user has already applied
 * to this pool or not
 *
 * @param candidates
 * @param id
 * @returns
 */
export const hasUserApplied = (
  candidates: Maybe<PoolCandidate>[],
  id: Maybe<Scalars["ID"]>,
) => {
  let hasApplied = false;
  if (candidates && id) {
    hasApplied = candidates.some((candidate) => candidate?.pool?.id === id);
  }

  return hasApplied;
};
