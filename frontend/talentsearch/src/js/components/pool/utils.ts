import {
  AdvertisementStatus,
  Maybe,
  PoolCandidate,
  Role,
  Scalars,
} from "../../api/generated";

/**
 * Determine if the advertisement can be
 * viewed based on user roles and statu
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
