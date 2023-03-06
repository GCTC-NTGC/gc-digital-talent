import React from "react";
import { IntlShape } from "react-intl";
import { getLocalizedName, getPoolStream } from "@gc-digital-talent/i18n";

import { SimpleClassification, SimplePool } from "~/types/pool";
import {
  AdvertisementStatus,
  Maybe,
  PoolCandidate,
  Scalars,
  PoolStream,
  PoolAdvertisement,
  Classification,
} from "~/api/generated";

import { RoleAssignment } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth/src/const";
import { wrapAbbr } from "./nameUtils";

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
 * @param roleAssignments
 * @param status
 * @returns boolean
 */
export const isAdvertisementVisible = (
  roleAssignments: Maybe<RoleAssignment>[],
  status?: Maybe<AdvertisementStatus>,
) => {
  let visible =
    roleAssignments
      .map((a) => a?.role?.name)
      .includes(ROLE_NAME.PlatformAdmin) ?? false;
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
export interface formattedPoolPosterTitleProps {
  title: Maybe<string>;
  classification: Maybe<Classification>;
  stream: Maybe<PoolStream>;
  intl: IntlShape;
}

export const formattedPoolPosterTitle = ({
  title,
  classification,
  stream,
  intl,
}: formattedPoolPosterTitleProps): {
  html: React.ReactNode;
  label: string;
} => {
  const streamString = stream
    ? `${intl.formatMessage(getPoolStream(stream))}`
    : "";

  const groupAndLevel = classification
    ? formatClassificationString(classification)
    : null ?? "";

  const genericTitle = `${groupAndLevel} ${streamString}`.trim();

  return {
    html: (
      <>
        {`${title ? `${title}` : ""}`} ({wrapAbbr(groupAndLevel, intl)}
        {streamString ? ` ${streamString}` : ""})
      </>
    ),
    label: `${title ? `${title}` : ""} ${
      genericTitle ? `(${genericTitle})` : ""
    }`.trim(),
  };
};

export const fullPoolAdvertisementTitle = (
  intl: IntlShape,
  poolAdvertisement: Maybe<
    Pick<PoolAdvertisement, "name" | "classifications" | "stream">
  >,
  options?: { defaultTitle?: string },
): { html: React.ReactNode; label: string } => {
  const fallbackTitle =
    options?.defaultTitle ??
    intl.formatMessage({
      id: "D91nGW",
      defaultMessage: "Job title not found.",
      description:
        "Message shown to user when pool name or classification are not found.",
    });

  if (poolAdvertisement === null || poolAdvertisement === undefined)
    return {
      html: fallbackTitle,
      label: fallbackTitle,
    };

  const specificTitle = getLocalizedName(poolAdvertisement.name, intl);

  const formattedTitle = formattedPoolPosterTitle({
    title: specificTitle,
    classification: poolAdvertisement?.classifications?.[0],
    stream: poolAdvertisement.stream,
    intl,
  });

  return {
    html: formattedTitle.html ?? fallbackTitle,
    label: formattedTitle.label ?? fallbackTitle,
  };
};

export const getFullPoolAdvertisementTitleHtml = (
  intl: IntlShape,
  poolAdvertisement: Maybe<
    Pick<PoolAdvertisement, "name" | "classifications" | "stream">
  >,
  options?: { defaultTitle?: string },
): React.ReactNode =>
  fullPoolAdvertisementTitle(intl, poolAdvertisement, options).html;

export const getFullPoolAdvertisementTitleLabel = (
  intl: IntlShape,
  poolAdvertisement: Maybe<
    Pick<PoolAdvertisement, "name" | "classifications" | "stream">
  >,
  options?: { defaultTitle?: string },
): string => fullPoolAdvertisementTitle(intl, poolAdvertisement, options).label;
