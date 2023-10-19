/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";

import { Pending, NotFound, Link, Heading, Pill } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import {
  useGetProcessInfoQuery,
  Scalars,
  Pool,
  PoolStatus,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import ProcessCard from "~/components/ProcessCard/ProcessCard";
import {
  getAdvertisementStatus,
  getFullPoolTitleHtml,
  getPoolCompletenessBadge,
  getProcessStatusBadge,
} from "~/utils/poolUtils";
import { PoolCompleteness } from "~/types/pool";
import { checkRole } from "~/utils/teamUtils";
import usePoolMutations from "~/hooks/usePoolMutations";

import SubmitForPublishingDialog from "./components/SubmitForPublishingDialog";
import DuplicateProcessDialog from "./components/DuplicateProcessDialog";
import ArchiveProcessDialog from "./components/ArchiveProcessDialog";
import UnarchiveProcessDialog from "./components/UnArchiveProcessDialog";
import DeleteProcessDialog from "./components/DeleteProcessDialog";
import ExtendProcessDialog from "./components/ExtendProcessDialog";
import PublishProcessDialog from "./components/PublishProcessDialog";

export interface ViewPoolProps {
  pool: Pool;
  isFetching: boolean;
  onPublish: () => Promise<void>;
  onDelete: () => Promise<void>;
  onExtend: (closingDate: Scalars["DateTime"]) => Promise<void>;
  onArchive: () => Promise<void>;
  onDuplicate: () => Promise<void>;
  onUnarchive: () => Promise<void>;
}

export const ViewPool = ({
  pool,
  isFetching,
  onPublish,
  onDelete,
  onExtend,
  onArchive,
  onDuplicate,
  onUnarchive,
}: ViewPoolProps): JSX.Element => {
  const intl = useIntl();
  const paths = useRoutes();
  const { roleAssignments } = useAuthorization();
  const poolName = getFullPoolTitleHtml(intl, pool);
  const advertisementStatus = getAdvertisementStatus(pool);
  const advertisementBadge = getPoolCompletenessBadge(advertisementStatus);
  const assessmentStatus = "incomplete" as PoolCompleteness;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const assessmentBadge = getPoolCompletenessBadge(assessmentStatus);
  const processBadge = getProcessStatusBadge(pool.status);
  const canPublish = checkRole(
    [ROLE_NAME.CommunityManager, ROLE_NAME.PlatformAdmin],
    roleAssignments,
  );

  let closingDate = "";
  if (pool.closingDate) {
    const closingDateObject = parseDateTimeUtc(pool.closingDate);
    closingDate = formatDate({
      date: closingDateObject,
      formatString: DATE_FORMAT_STRING,
      intl,
    });
  }

  const commonDialogProps = {
    poolName,
    isFetching,
  };

  const pageTitle = intl.formatMessage({
    defaultMessage: "Process information",
    id: "IWWSkL",
    description: "Page title for the individual pool page",
  });

  const pageSubtitle = intl.formatMessage({
    defaultMessage: "Manage and view information about your process. ",
    id: "pM43Xu",
    description: "Subtitle for the individual pool page",
  });

  /** TO DO: Replace this message and link with
   * appropriate values once assessment plan feature
   * has been developed (#7916)
   */
  const comingSoon = intl.formatMessage({
    defaultMessage: "Coming soon",
    id: "/IMv2G",
    description:
      "Message displayed when a feature is in development and not ready yet",
  });

  return (
    <>
      <SEO title={pageTitle} description={pageSubtitle} />
      <div data-h2-container="base(left, large, 0)">
        <Heading level="h2" Icon={UserGroupIcon} color="primary">
          {pageTitle}
        </Heading>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "From here you can duplicate, delete or submit your process for publication. Your process can be published once the advertisement information and assessment plan are complete.",
            id: "k2RLxv",
            description:
              "Description of the actions that can be taken on the process information admin page",
          })}
        </p>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) l-tablet(repeat(2, 1fr))"
          data-h2-gap="base(x1 0) l-tablet(x1)"
        >
          <ProcessCard.Root>
            <ProcessCard.Header>
              <Heading level="h3" size="h6" data-h2-margin="base(0)">
                {intl.formatMessage({
                  defaultMessage: "Advertisement information",
                  id: "myH7I0",
                  description:
                    "Title for card for actions related to a process advertisement",
                })}
              </Heading>
              <Pill
                bold
                mode="outline"
                color={advertisementBadge.color}
                data-h2-flex-shrink="base(0)"
              >
                {intl.formatMessage(advertisementBadge.label)}
              </Pill>
            </ProcessCard.Header>
            <p data-h2-margin="base(x1 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Define the process information such as classification, impact, and skill requirements.",
                id: "LY898b",
                description:
                  "Information about what an advertisement represents",
              })}
            </p>
            <ProcessCard.Footer>
              {advertisementStatus !== "submitted" && (
                <Link
                  mode="inline"
                  color="secondary"
                  href={paths.poolUpdate(pool.id)}
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit advertisement",
                    id: "80mwrF",
                    description:
                      "Link text to edit a specific pool advertisement",
                  })}
                </Link>
              )}
              <Link
                mode="inline"
                color="secondary"
                href={paths.pool(pool.id)}
                newTab
              >
                {advertisementStatus === "submitted"
                  ? intl.formatMessage({
                      defaultMessage: "View advertisement",
                      id: "8gyWTT",
                      description:
                        "Link text to view a specific pool advertisement",
                    })
                  : intl.formatMessage({
                      defaultMessage: "Preview advertisement",
                      id: "AhZlU1",
                      description:
                        "Link text to preview a specific pool advertisement",
                    })}
              </Link>
            </ProcessCard.Footer>
          </ProcessCard.Root>
          <ProcessCard.Root>
            <ProcessCard.Header>
              <Heading level="h3" size="h6" data-h2-margin="base(0)">
                {intl.formatMessage({
                  defaultMessage: "Assessment plan",
                  id: "eGNxdM",
                  description:
                    "Title for card for actions related to a process' assessment plan",
                })}
              </Heading>
              <Pill
                bold
                mode="outline"
                color="black"
                data-h2-flex-shrink="base(0)"
              >
                {comingSoon}
              </Pill>
            </ProcessCard.Header>
            <p data-h2-margin="base(x1 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Define the assessments used to evaluate each skill in the advertisement.",
                id: "Fs444j",
                description:
                  "Information about what an assessment plan represents",
              })}
            </p>
            <ProcessCard.Footer>
              <Link mode="inline" color="secondary" href="#">
                {comingSoon}
                {/* {assessmentStatus === "submitted"
                  ? intl.formatMessage({
                      defaultMessage: "View assessment plan",
                      id: "1X7JVN",
                      description:
                        "Link text to view a specific pool assessment",
                    })
                  : intl.formatMessage({
                      defaultMessage: "Edit assessment plan",
                      id: "Q3adCp",
                      description:
                        "Link text to edit a specific pool assessment",
                    })} */}
              </Link>
            </ProcessCard.Footer>
          </ProcessCard.Root>
          <ProcessCard.Root data-h2-grid-column="l-tablet(span 2)">
            <ProcessCard.Header>
              <Heading level="h3" size="h6" data-h2-margin="base(0 0 x1 0)">
                {intl.formatMessage({
                  defaultMessage: "Process status",
                  id: "KJDxM1",
                  description:
                    "Title for card for actions related to changing the status of a process",
                })}
              </Heading>
              <Pill
                bold
                mode="outline"
                color={processBadge.color}
                icon={processBadge.icon}
                data-h2-flex-shrink="base(0)"
              >
                {intl.formatMessage(processBadge.label)}
              </Pill>
            </ProcessCard.Header>
            {pool.status === PoolStatus.Published && (
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "This process is <heavyPrimary>open</heavyPrimary> and accepting applications until <heavyPrimary>{closingDate}</heavyPrimary>.",
                    id: "6c5+AE",
                    description:
                      "Message displayed to admins when a process is published",
                  },
                  {
                    closingDate,
                  },
                )}
              </p>
            )}
            {[PoolStatus.Archived, PoolStatus.Closed].includes(
              pool.status ?? PoolStatus.Draft,
            ) && (
              <p data-h2-margin="base(x1 0)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "This process <heavyRed>closed</heavyRed> on <heavyRed>{closingDate}</heavyRed> and is no longer accepting applications.",
                    id: "nKCUhO",
                    description:
                      "Message displayed to admins when a process is closed or archived",
                  },
                  {
                    closingDate,
                  },
                )}
              </p>
            )}
            {pool.status === PoolStatus.Draft ? (
              <>
                <p data-h2-margin="base(x1 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "This process is in <heavyWarning>draft</heavyWarning> and has not been advertised yet.",
                    id: "VYzAZy",
                    description:
                      "Message displayed to admins when a process is in draft mode",
                  })}
                </p>
                <p
                  data-h2-margin="base(x1 0)"
                  data-h2-color="base(black.light)"
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "Publish your advertisement to start receiving applications.",
                    id: "dImJqI",
                    description:
                      "Instructions on a draft process on how to start getting applicants",
                  })}
                </p>
              </>
            ) : (
              <p data-h2-margin="base(x1 0)" data-h2-color="base(black.light)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "{count, plural, =0 {0 total applicants} =1 {1 total applicant} other {# total applicants}}",
                    id: "ilZlfH",
                    description:
                      "The number of applicants to a specific process",
                  },
                  {
                    count: pool?.poolCandidates?.length ?? 0,
                  },
                )}
              </p>
            )}
            <ProcessCard.Footer>
              {!canPublish && pool.status === PoolStatus.Draft && (
                <SubmitForPublishingDialog isReadyToPublish={pool.isComplete} />
              )}
              {[PoolStatus.Closed, PoolStatus.Published].includes(
                pool.status ?? PoolStatus.Draft,
              ) && (
                <ExtendProcessDialog
                  {...commonDialogProps}
                  closingDate={pool.closingDate}
                  onExtend={onExtend}
                />
              )}
              {checkRole([ROLE_NAME.PoolOperator], roleAssignments) && (
                <DuplicateProcessDialog
                  {...commonDialogProps}
                  onDuplicate={onDuplicate}
                />
              )}
              {pool.status === PoolStatus.Closed && (
                <ArchiveProcessDialog
                  {...commonDialogProps}
                  onArchive={onArchive}
                />
              )}
              {pool.status === PoolStatus.Archived && (
                <UnarchiveProcessDialog
                  {...commonDialogProps}
                  onUnarchive={onUnarchive}
                />
              )}
              {pool.status === PoolStatus.Draft && (
                <DeleteProcessDialog
                  {...commonDialogProps}
                  onDelete={onDelete}
                />
              )}
              {pool.status === PoolStatus.Draft && canPublish && (
                <PublishProcessDialog
                  {...commonDialogProps}
                  closingDate={pool.closingDate}
                  onPublish={onPublish}
                />
              )}
            </ProcessCard.Footer>
          </ProcessCard.Root>
        </div>
      </div>
    </>
  );
};

type RouteParams = {
  poolId: Scalars["ID"];
};

const ViewPoolPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { poolId } = useParams<RouteParams>();
  const { isFetching, mutations } = usePoolMutations();
  const [{ data, fetching, error }] = useGetProcessInfoQuery({
    variables: { id: poolId || "" },
  });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.home(),
    },
    {
      label: intl.formatMessage(adminMessages.pools),
      url: routes.poolTable(),
    },
    ...(poolId
      ? [
          {
            label: getLocalizedName(data?.pool?.name, intl),
            url: routes.poolView(poolId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending fetching={fetching} error={error}>
        {poolId && data?.pool ? (
          <ViewPool
            pool={data.pool}
            isFetching={isFetching}
            onExtend={async (newClosingDate: string) => {
              return mutations.extend(poolId, newClosingDate);
            }}
            onDuplicate={async () => {
              return mutations.duplicate(poolId, data?.pool?.team?.id || "");
            }}
            onArchive={async () => {
              return mutations.archive(poolId);
            }}
            onUnarchive={async () => {
              return mutations.unarchive(poolId);
            }}
            onDelete={async () => {
              return mutations.delete(poolId);
            }}
            onPublish={async () => {
              return mutations.publish(poolId);
            }}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Pool {poolId} not found.",
                  id: "Sb2fEr",
                  description: "Message displayed for pool not found.",
                },
                { poolId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default ViewPoolPage;
