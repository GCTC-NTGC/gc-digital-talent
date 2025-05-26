/* eslint-disable formatjs/no-literal-string-in-jsx */
import { IntlShape, MessageDescriptor } from "react-intl";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import ClipboardDocumentListIcon from "@heroicons/react/20/solid/ClipboardDocumentListIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import RocketLaunchIcon from "@heroicons/react/20/solid/RocketLaunchIcon";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import { ReactNode } from "react";

import {
  commonMessages,
  getLocalizedName,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";
import { nodeToString, notEmpty } from "@gc-digital-talent/helpers";
import { ChipProps, IconType } from "@gc-digital-talent/ui";
import {
  PublishingGroup,
  RoleAssignment,
  PoolStatus,
  Maybe,
  Classification,
  Pool,
  LocalizedPoolStatus,
  WorkStream,
} from "@gc-digital-talent/graphql";

import { PageNavInfo } from "~/types/pages";
import useRoutes from "~/hooks/useRoutes";
import poolMessages from "~/messages/poolMessages";
import { PageNavKeys, PoolCompleteness } from "~/types/pool";
import messages from "~/messages/adminMessages";

import { wrapAbbr } from "./nameUtils";

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
    ROLE_NAME.ProcessOperator,
    ROLE_NAME.CommunityRecruiter,
    ROLE_NAME.CommunityAdmin,
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

export function isIAPPool(publishingGroup?: Maybe<PublishingGroup>): boolean {
  return publishingGroup === PublishingGroup.Iap;
}

export function isExecPool(publishingGroup?: Maybe<PublishingGroup>): boolean {
  return publishingGroup === PublishingGroup.ExecutiveJobs;
}

interface formatClassificationStringProps {
  group: string;
  level: number;
}

export const formatClassificationString = ({
  group,
  level,
}: formatClassificationStringProps): string => {
  return `${group}-${level < 10 ? "0" : ""}${level}`;
};
interface formattedPoolPosterTitleProps {
  title: Maybe<string> | undefined;
  classification: Maybe<Pick<Classification, "group" | "level">> | undefined;
  workStream?: Maybe<WorkStream>;
  short?: boolean;
  intl: IntlShape;
}

export const formattedPoolPosterTitle = ({
  title,
  classification,
  workStream,
  short,
  intl,
}: formattedPoolPosterTitleProps): {
  html: ReactNode;
  label: string;
} => {
  const streamString = getLocalizedName(workStream?.name, intl, true);
  const groupAndLevel = classification
    ? formatClassificationString(classification)
    : "";

  const genericTitle = short
    ? `${groupAndLevel.trim()}${intl.formatMessage(
        commonMessages.dividingColon,
      )}`
    : `${groupAndLevel} ${streamString}`.trim();
  const hasGroupAndLevel = groupAndLevel.length > 0;

  return {
    html: short ? (
      <>
        {hasGroupAndLevel ? (
          <>
            {wrapAbbr(groupAndLevel, intl)}
            {intl.formatMessage(commonMessages.dividingColon)}
          </>
        ) : null}
        {title ?? ""}
      </>
    ) : (
      <>
        {title ?? ""} ({wrapAbbr(groupAndLevel, intl)}
        {streamString ? ` ${streamString}` : ""})
      </>
    ),
    label: short
      ? `${hasGroupAndLevel ? genericTitle : ""}${title ?? ""}`.trim()
      : `${title ?? ""} ${genericTitle ? `(${genericTitle})` : ""}`.trim(),
  };
};

interface PoolTitleOptions {
  defaultTitle?: ReactNode;
  short?: boolean;
}

type PoolTitle = Maybe<
  Pick<Pool, "name" | "publishingGroup" | "workStream"> & {
    classification?: Maybe<Pick<Classification, "group" | "level">>;
  }
>;

export const poolTitle = (
  intl: IntlShape,
  pool: PoolTitle,
  options?: PoolTitleOptions,
): { html: ReactNode; label: string } => {
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
      label: nodeToString(fallbackTitle),
    };

  const specificTitle = getLocalizedName(pool?.name, intl);

  if (isIAPPool(pool.publishingGroup?.value)) {
    return {
      html: specificTitle,
      label: specificTitle,
    };
  }

  const formattedTitle = formattedPoolPosterTitle({
    title: specificTitle,
    classification: pool?.classification,
    workStream: pool?.workStream,
    short: options?.short,
    intl,
  });

  return {
    html: formattedTitle.html ?? fallbackTitle,
    label: formattedTitle.label ?? fallbackTitle,
  };
};

export const getFullPoolTitleHtml = (
  intl: IntlShape,
  pool: PoolTitle,
  options?: { defaultTitle?: string },
): ReactNode => poolTitle(intl, pool, options).html;

export const getFullPoolTitleLabel = (
  intl: IntlShape,
  pool: PoolTitle,
  options?: { defaultTitle?: string },
): string => poolTitle(intl, pool, options).label;

export const getShortPoolTitleHtml = (
  intl: IntlShape,
  pool: PoolTitle,
  options?: { defaultTitle?: string },
): ReactNode =>
  poolTitle(intl, pool, {
    ...options,
    short: true,
  }).html;

export const getShortPoolTitleLabel = (
  intl: IntlShape,
  pool: PoolTitle,
  options?: { defaultTitle?: string },
): string =>
  poolTitle(intl, pool, {
    ...options,
    short: true,
  }).label;

export const useAdminPoolPages = (
  intl: IntlShape,
  pool: Pick<Pool, "id"> & PoolTitle,
) => {
  const paths = useRoutes();
  const poolName = getFullPoolTitleLabel(intl, {
    workStream: pool.workStream,
    name: pool.name,
    publishingGroup: pool.publishingGroup,
    classification: pool.classification,
  });

  return new Map<PageNavKeys, PageNavInfo>([
    [
      "view",
      {
        icon: ClipboardDocumentIcon,
        title: intl.formatMessage({
          defaultMessage: "Process information",
          id: "R5sGKY",
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
          defaultMessage: "Advertisement information",
          id: "yM04jy",
          description: "Title for advertisement information of a process",
        }),
        subtitle: intl.formatMessage({
          defaultMessage:
            "Define the information and requirements for this recruitment process.",
          id: "Kyf9At",
          description: "Description of a process' advertisement",
        }),
        link: {
          url: paths.poolUpdate(pool.id),
        },
        crumbs: [
          {
            url: paths.adminDashboard(),
            label: intl.formatMessage(navigationMessages.home),
          },
          {
            url: paths.poolTable(),
            label: intl.formatMessage({
              defaultMessage: "Processes",
              id: "aAIZbC",
              description: "Link to the Pools page in the nav menu.",
            }),
          },
          {
            url: paths.poolView(pool.id),
            label: poolName,
          },
          {
            url: paths.poolUpdate(pool.id),
            label: intl.formatMessage({
              defaultMessage: "Advertisement information",
              id: "yM04jy",
              description: "Title for advertisement information of a process",
            }),
          },
        ],
      },
    ],
    [
      "plan",
      {
        title: intl.formatMessage(messages.assessmentPlan),
        subtitle: intl.formatMessage({
          defaultMessage:
            "Select, organize and define the assessments used to evaluate each skill in the advertisement.",
          id: "2ZjclP",
          description: "Subtitle for the assessment plan builder",
        }),
        link: {
          url: paths.assessmentPlanBuilder(pool.id),
        },
        crumbs: [
          {
            url: paths.adminDashboard(),
            label: intl.formatMessage(navigationMessages.home),
          },
          {
            url: paths.poolTable(),
            label: intl.formatMessage({
              defaultMessage: "Processes",
              id: "aAIZbC",
              description: "Link to the Pools page in the nav menu.",
            }),
          },
          {
            url: paths.poolView(pool.id),
            label: poolName,
          },
          {
            url: paths.assessmentPlanBuilder(pool.id),
            label: intl.formatMessage(messages.assessmentPlan),
          },
        ],
      },
    ],
    [
      "screening",
      {
        title: intl.formatMessage({
          defaultMessage: "Screening and assessment",
          id: "R8Naqm",
          description: "Heading for the information of an application",
        }),
        link: {
          url: paths.screeningAndEvaluation(pool.id),
        },
      },
    ],
    [
      "candidates",
      {
        icon: UserGroupIcon,
        title: intl.formatMessage({
          defaultMessage: "Talent placement",
          id: "0YpfAG",
          description: "Title for candidates tab for a process",
        }),
        link: {
          url: paths.poolCandidateTable(pool.id),
        },
      },
    ],
    [
      "manage-access",
      {
        title: intl.formatMessage({
          defaultMessage: "Manage access",
          id: "J0i4xY",
          description: "Title for members page",
        }),
        link: {
          url: paths.poolManageAccess(pool.id),
        },
      },
    ],
  ]);
};

export const getAdvertisementStatus = (
  pool?: Pick<Pool, "publishedAt" | "isComplete">,
): PoolCompleteness => {
  if (!pool) return "incomplete";

  if (pool.publishedAt) return "submitted";

  return pool.isComplete ? "complete" : "incomplete";
};

interface StatusBadge {
  color: ChipProps["color"];
  label?: MessageDescriptor | string;
  icon?: IconType;
}

const defaultCompleteness: StatusBadge = {
  color: "error",
  label: poolMessages.incomplete,
};

const poolCompletenessMap = new Map<PoolCompleteness, StatusBadge>([
  [
    "complete",
    {
      color: "success",
      label: poolMessages.complete,
    },
  ],
  ["incomplete", defaultCompleteness],
  [
    "submitted",
    {
      color: "black",
      label: poolMessages.submitted,
    },
  ],
]);

export const getPoolCompletenessBadge = (completeness: PoolCompleteness) => {
  const badgeInfo = poolCompletenessMap.get(completeness);

  return badgeInfo ?? defaultCompleteness;
};

export const getProcessStatusBadge = (
  status: Maybe<LocalizedPoolStatus> | undefined,
  intl: IntlShape,
): StatusBadge => {
  const statusBadge: StatusBadge = {
    color: "black",
    label: getLocalizedName(status?.label, intl),
    icon: LockClosedIcon,
  };

  if (status?.value === PoolStatus.Draft) {
    return {
      ...statusBadge,
      color: "warning",
      icon: ClipboardDocumentListIcon,
    };
  }

  if (status?.value === PoolStatus.Published) {
    return {
      label: intl.formatMessage(poolMessages.open),
      color: "secondary",
      icon: RocketLaunchIcon,
    };
  }

  return statusBadge;
};

export function getClassificationName(
  { group, level, name }: Pick<Classification, "group" | "level" | "name">,
  intl: IntlShape,
) {
  const groupLevelStr = `${group}-${level < 10 ? "0" : ""}${level}`;

  if (!name) {
    return groupLevelStr;
  }

  const nameStr = getLocalizedName(name, intl);
  return `${groupLevelStr} (${nameStr})`;
}
