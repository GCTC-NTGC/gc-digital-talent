import React from "react";
import { IntlShape } from "react-intl";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";

import { getLocalizedName, getPoolStream } from "@gc-digital-talent/i18n";
import {
  PublishingGroup,
  RoleAssignment,
  PoolStatus,
  Maybe,
  PoolCandidate,
  Scalars,
  PoolStream,
  Classification,
  Pool,
} from "~/api/generated";
import { PageNavInfo } from "~/types/pages";
import useRoutes from "~/hooks/useRoutes";
import { ONGOING_PUBLISHING_GROUPS } from "~/constants/pool";
import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";

import { PageNavKeys, SimpleClassification, SimplePool } from "~/types/pool";

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
  status?: Maybe<PoolStatus>,
) => {
  if (status !== PoolStatus.Draft) {
    return true;
  }
  const allowedRoles: RoleName[] = [
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.PoolOperator,
  ];
  return (
    roleAssignments.filter(notEmpty).some((assignment) => {
      return (
        assignment.role?.name &&
        allowedRoles.includes(assignment.role.name as RoleName)
      );
    }) ?? false
  );
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

export function isIAPPool(pool: Maybe<Pool>): boolean {
  return pool?.publishingGroup === PublishingGroup.Iap;
}

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

interface FullPoolTitleOptions {
  defaultTitle?: React.ReactNode;
}

export const fullPoolTitle = (
  intl: IntlShape,
  pool: Maybe<Pool>,
  options?: FullPoolTitleOptions,
): { html: React.ReactNode; label: string } => {
  const fallbackTitle =
    options?.defaultTitle ??
    intl.formatMessage({
      id: "D91nGW",
      defaultMessage: "Job title not found.",
      description:
        "Message shown to user when pool name or classification are not found.",
    });

  if (pool === null || pool === undefined)
    return {
      html: fallbackTitle,
      label: fallbackTitle.toString(),
    };

  const specificTitle = getLocalizedName(pool.name, intl);

  if (isIAPPool(pool)) {
    return {
      html: specificTitle,
      label: specificTitle,
    };
  }

  const formattedTitle = formattedPoolPosterTitle({
    title: specificTitle,
    classification: pool?.classifications?.[0],
    stream: pool.stream,
    intl,
  });

  return {
    html: formattedTitle.html ?? fallbackTitle,
    label: formattedTitle.label ?? fallbackTitle,
  };
};

export const getFullPoolTitleHtml = (
  intl: IntlShape,
  pool: Maybe<Pool>,
  options?: { defaultTitle?: string },
): React.ReactNode => fullPoolTitle(intl, pool, options).html;

export const getFullPoolTitleLabel = (
  intl: IntlShape,
  pool: Maybe<Pool>,
  options?: { defaultTitle?: string },
): string => fullPoolTitle(intl, pool, options).label;

export const useAdminPoolPages = (intl: IntlShape, pool: Pool) => {
  const paths = useRoutes();

  return new Map<PageNavKeys, PageNavInfo>([
    [
      "view",
      {
        icon: ClipboardDocumentIcon,
        title: intl.formatMessage({
          defaultMessage: "Pool information",
          id: "Cjp2F6",
          description: "Title for the pool info page",
        }),
        link: {
          url: paths.poolView(pool.id),
        },
      },
    ],
    [
      "edit",
      {
        icon: Cog8ToothIcon,
        title: intl.formatMessage({
          defaultMessage: "Edit pool",
          id: "l7Wu86",
          description: "Title for the edit pool page",
        }),
        link: {
          url: paths.poolUpdate(pool.id),
        },
      },
    ],
    [
      "candidates",
      {
        icon: UserGroupIcon,
        title: intl.formatMessage({
          defaultMessage: "Candidates",
          id: "X4TOhW",
          description: "Page title for the admin pool candidates index page",
        }),
        link: {
          url: paths.poolCandidateTable(pool.id),
          label: intl.formatMessage({
            defaultMessage: "View Candidates",
            id: "Rl+0Er",
            description: "Title for the edit pool page",
          }),
        },
      },
    ],
  ]);
};

export const isOngoingPublishingGroup = (
  publishingGroup: Maybe<PublishingGroup>,
): boolean =>
  publishingGroup ? ONGOING_PUBLISHING_GROUPS.includes(publishingGroup) : false;
