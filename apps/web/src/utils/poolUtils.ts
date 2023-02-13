import { IntlShape } from "react-intl";

import { getLocalizedName, getPoolStream } from "@gc-digital-talent/i18n";

import { SimpleClassification, SimplePool } from "~/types/pool";
import {
  AdvertisementStatus,
  Maybe,
  PoolCandidate,
  LegacyRole,
  Scalars,
  PoolStream,
  PoolAdvertisement,
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
  roles: Maybe<LegacyRole>[],
  status?: Maybe<AdvertisementStatus>,
) => {
  let visible = roles.includes(LegacyRole.Admin) ?? false;
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

export interface formattedPoolPosterTitleProps {
  title: Maybe<string>;
  classification: Maybe<string>;
  stream: Maybe<PoolStream>;
  intl: IntlShape;
}

export const formattedPoolPosterTitle = ({
  title,
  classification,
  stream,
  intl,
}: formattedPoolPosterTitleProps): string => {
  const streamString = stream
    ? `${intl.formatMessage(getPoolStream(stream))}`
    : "";
  const genericTitle = `${classification ?? ""} ${streamString}`.trim();
  return `${title ? `${title}` : ""}${
    genericTitle ? ` (${genericTitle})` : "" // Wrap genericTitle in parentheses if it exists
  }`.trim();
};

export interface formatClassificationStringProps {
  group: string;
  level: number;
}

export const formatClassificationString = ({
  group,
  level,
}: formatClassificationStringProps): string => {
  return `${group}-0${level}`;
};

export const getFullPoolAdvertisementTitle = (
  intl: IntlShape,
  poolAdvertisement: Maybe<
    Pick<PoolAdvertisement, "name" | "classifications" | "stream">
  >,
  options?: { defaultTitle?: string },
): string => {
  const fallbackTitle =
    options?.defaultTitle ??
    intl.formatMessage({
      id: "D91nGW",
      defaultMessage: "Job title not found.",
      description:
        "Message shown to user when pool name or classification are not found.",
    });

  if (poolAdvertisement === null || poolAdvertisement === undefined)
    return fallbackTitle;

  const formattedClassification = poolAdvertisement?.classifications?.[0] // TODO: If a pool has multiple classifications, only the first will be shown.
    ? formatClassificationString(poolAdvertisement?.classifications?.[0])
    : null;

  const specificTitle = getLocalizedName(poolAdvertisement.name, intl);

  const formattedTitle = formattedPoolPosterTitle({
    title: specificTitle,
    classification: formattedClassification,
    stream: poolAdvertisement.stream,
    intl,
  });
  return formattedTitle ?? fallbackTitle;
};
