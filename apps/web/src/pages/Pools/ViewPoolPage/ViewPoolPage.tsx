import { useIntl } from "react-intl";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { useQuery } from "urql";

import {
  Pending,
  NotFound,
  Link,
  Heading,
  Chip,
  Container,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  DATE_FORMAT_STRING,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import {
  FragmentType,
  getFragment,
  graphql,
  PoolStatus,
  Scalars,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import ProcessCard from "~/components/ProcessCard/ProcessCard";
import {
  getAdvertisementStatus,
  getShortPoolTitleHtml,
  getPoolCompletenessBadge,
  getProcessStatusBadge,
} from "~/utils/poolUtils";
import { checkRole } from "~/utils/teamUtils";
import usePoolMutations from "~/hooks/usePoolMutations";
import { getAssessmentPlanStatus } from "~/validators/pool/assessmentPlan";
import messages from "~/messages/adminMessages";
import processMessages from "~/messages/processMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import ProcessPreviewLink from "~/components/ProcessPreviewLink/ProcessPreviewLink";

import SubmitForPublishingDialog from "./components/SubmitForPublishingDialog";
import DuplicateProcessDialog, {
  DuplicatePoolDepartment_Fragment,
} from "./components/DuplicateProcessDialog";
import ArchiveProcessDialog from "./components/ArchiveProcessDialog";
import UnarchiveProcessDialog from "./components/UnArchiveProcessDialog";
import DeleteProcessDialog from "./components/DeleteProcessDialog";
import ChangeDateDialog from "./components/ChangeDateDialog";
import PublishProcessDialog from "./components/PublishProcessDialog";

export const ViewPool_Fragment = graphql(/* GraphQL */ `
  fragment ViewPool on Pool {
    ...AssessmentPlanStatus
    id
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    publishedAt
    isComplete
    status {
      value
      label {
        en
        fr
      }
    }
    closingDate
    processNumber
    workStream {
      id
      name {
        en
        fr
      }
    }
    poolCandidatesCount
    classification {
      id
      group
      level
    }
    name {
      en
      fr
    }
  }
`);

export interface ViewPoolProps {
  poolQuery: FragmentType<typeof ViewPool_Fragment>;
  departmentsQuery: FragmentType<typeof DuplicatePoolDepartment_Fragment>[];
  isFetching: boolean;
  onPublish: () => Promise<void>;
  onDelete: () => Promise<void>;
  onExtend: (closingDate: Scalars["DateTime"]["output"]) => Promise<void>;
  onClose: (reason: string) => Promise<void>;
  onArchive: () => Promise<void>;
  onDuplicate: (opts: {
    department: Scalars["ID"]["output"] | undefined;
  }) => Promise<void>;
  onUnarchive: () => Promise<void>;
}

export const ViewPool = ({
  poolQuery,
  departmentsQuery,
  isFetching,
  onPublish,
  onDelete,
  onExtend,
  onClose,
  onArchive,
  onDuplicate,
  onUnarchive,
}: ViewPoolProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { roleAssignments } = useAuthorization();
  const pool = getFragment(ViewPool_Fragment, poolQuery);
  const poolName = getShortPoolTitleHtml(intl, {
    workStream: pool.workStream,
    name: pool.name,
    publishingGroup: pool.publishingGroup,
    classification: pool.classification,
  });
  const advertisementStatus = getAdvertisementStatus({
    publishedAt: pool.publishedAt,
    isComplete: pool.isComplete,
  });
  const advertisementBadge = getPoolCompletenessBadge(advertisementStatus);
  const assessmentStatus = getAssessmentPlanStatus(pool);
  const assessmentBadge = getPoolCompletenessBadge(assessmentStatus);
  const processBadge = getProcessStatusBadge(pool.status, intl);
  const canPublish = checkRole([ROLE_NAME.CommunityAdmin], roleAssignments);
  // Editing a published pool is restricted to same roles who can publish it in the first place.
  const canEdit = advertisementStatus !== "submitted" || canPublish;
  const canDuplicate = checkRole(
    [ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin],
    roleAssignments,
  );
  const canArchive = checkRole(
    [ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin],
    roleAssignments,
  );
  const canDelete = checkRole(
    [ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin],
    roleAssignments,
  );

  let closingDate = "";
  if (pool.closingDate) {
    const closingDateObject = parseDateTimeUtc(pool.closingDate);
    closingDate = formatDate({
      date: closingDateObject,
      formatString: DATE_FORMAT_STRING,
      intl,
      timeZone: "Canada/Pacific",
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
    defaultMessage: "Manage and view information about your process.",
    id: "6+MKIv",
    description: "Subtitle for the individual pool page",
  });

  const isReadyToPublish =
    advertisementStatus === "complete" && assessmentStatus === "complete";

  return (
    <>
      <SEO title={pageTitle} description={pageSubtitle} />
      <Heading
        level="h2"
        icon={UserGroupIcon}
        color="secondary"
        className="mt-0"
      >
        {pageTitle}
      </Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "From here you can duplicate, delete or submit your process for publication. Your process can be published once the advertisement information and assessment plan are complete.",
          id: "k2RLxv",
          description:
            "Description of the actions that can be taken on the process information admin page",
        })}
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        <ProcessCard.Root>
          <ProcessCard.Header>
            <Heading level="h3" size="h6" className="mt-0">
              {intl.formatMessage({
                defaultMessage: "Advertisement information",
                id: "yM04jy",
                description: "Title for advertisement information of a process",
              })}
            </Heading>
            {advertisementBadge.label && (
              <Chip color={advertisementBadge.color} className="shrink-0">
                {typeof advertisementBadge.label === "string"
                  ? advertisementBadge.label
                  : intl.formatMessage(advertisementBadge.label)}
              </Chip>
            )}
          </ProcessCard.Header>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                "Define the process information such as classification, impact, and skill requirements.",
              id: "LY898b",
              description: "Information about what an advertisement represents",
            })}
          </p>
          <p className="my-6">
            {intl.formatMessage(processMessages.processNumber)}
            {intl.formatMessage(commonMessages.dividingColon)}
            {pool.processNumber ?? (
              <span className="text-error-700 dark:text-error-100">
                {intl.formatMessage(commonMessages.notProvided)}
              </span>
            )}
          </p>
          <ProcessCard.Footer>
            {canEdit && (
              <Link
                mode="inline"
                color={
                  pool.status?.value === PoolStatus.Published
                    ? "error"
                    : "primary"
                }
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
            <ProcessPreviewLink status={advertisementStatus} id={pool.id} />
          </ProcessCard.Footer>
        </ProcessCard.Root>
        <ProcessCard.Root>
          <ProcessCard.Header>
            <Heading level="h3" size="h6" className="mt-0">
              {intl.formatMessage(messages.assessmentPlan)}
            </Heading>
            {assessmentBadge.label && (
              <Chip color={assessmentBadge.color} className="shrink-0">
                {typeof assessmentBadge.label === "string"
                  ? assessmentBadge.label
                  : intl.formatMessage(assessmentBadge.label)}
              </Chip>
            )}
          </ProcessCard.Header>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                "Define the assessments used to evaluate each skill in the advertisement.",
              id: "Fs444j",
              description:
                "Information about what an assessment plan represents",
            })}
          </p>
          <ProcessCard.Footer>
            <Link
              mode="inline"
              color="primary"
              href={paths.assessmentPlanBuilder(pool.id)}
            >
              {assessmentStatus === "submitted"
                ? intl.formatMessage({
                    defaultMessage: "View assessment plan",
                    id: "1X7JVN",
                    description: "Link text to view a specific pool assessment",
                  })
                : intl.formatMessage({
                    defaultMessage: "Edit assessment plan",
                    id: "Q3adCp",
                    description: "Link text to edit a specific pool assessment",
                  })}
            </Link>
          </ProcessCard.Footer>
        </ProcessCard.Root>
        <ProcessCard.Root className="sm:col-span-2">
          <ProcessCard.Header>
            <Heading level="h3" size="h6" className="mt-0 mb-6">
              {intl.formatMessage({
                defaultMessage: "Process status",
                id: "KJDxM1",
                description:
                  "Title for card for actions related to changing the status of a process",
              })}
            </Heading>
            {processBadge.label && (
              <Chip
                color={processBadge.color}
                icon={processBadge.icon}
                className="shrink-0"
              >
                {typeof processBadge.label === "string"
                  ? processBadge.label
                  : intl.formatMessage(processBadge.label)}
              </Chip>
            )}
          </ProcessCard.Header>
          {pool.status?.value === PoolStatus.Published && (
            <p className="my-6">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "This process is <heavySecondary>open</heavySecondary> and accepting applications until <heavySecondary>{closingDate}</heavySecondary>.",
                  id: "JlTf/G",
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
            pool.status?.value ?? PoolStatus.Draft,
          ) && (
            <p className="my-6">
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
          {pool.status?.value === PoolStatus.Draft ? (
            <>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "This process is in <heavyWarning>draft</heavyWarning> and has not been advertised yet.",
                  id: "VYzAZy",
                  description:
                    "Message displayed to admins when a process is in draft mode",
                })}
              </p>
              <p className="my-6 text-gray-600 dark:text-gray-200">
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
            <p className="my-6 text-gray-600 dark:text-gray-200">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "{count, plural, =0 {0 total applicants} one {# total applicant} other {# total applicants}}",
                  id: "HYUyl0",
                  description: "The number of applicants to a specific process",
                },
                {
                  count: pool.poolCandidatesCount ?? 0,
                },
              )}
            </p>
          )}
          <ProcessCard.Footer>
            {pool.status?.value === PoolStatus.Draft && canPublish && (
              <PublishProcessDialog
                {...commonDialogProps}
                closingDate={pool.closingDate}
                onPublish={onPublish}
                isReadyToPublish={isReadyToPublish}
              />
            )}
            {!canPublish && pool.status?.value === PoolStatus.Draft && (
              <SubmitForPublishingDialog isReadyToPublish={isReadyToPublish} />
            )}
            {[PoolStatus.Closed, PoolStatus.Published].includes(
              pool.status?.value ?? PoolStatus.Draft,
            ) &&
              canPublish && (
                <ChangeDateDialog
                  {...commonDialogProps}
                  closingDate={pool.closingDate}
                  onExtend={onExtend}
                  onClose={onClose}
                />
              )}
            {canDuplicate && (
              <DuplicateProcessDialog
                {...commonDialogProps}
                departmentsQuery={departmentsQuery}
                onDuplicate={onDuplicate}
              />
            )}
            {pool.status?.value === PoolStatus.Closed && canArchive && (
              <ArchiveProcessDialog
                {...commonDialogProps}
                onArchive={onArchive}
              />
            )}
            {pool.status?.value === PoolStatus.Archived && canArchive && (
              <UnarchiveProcessDialog
                {...commonDialogProps}
                onUnarchive={onUnarchive}
              />
            )}
            {pool.status?.value === PoolStatus.Draft && canDelete && (
              <DeleteProcessDialog {...commonDialogProps} onDelete={onDelete} />
            )}
          </ProcessCard.Footer>
        </ProcessCard.Root>
      </div>
    </>
  );
};

interface RouteParams extends Record<string, string> {
  poolId: Scalars["ID"]["output"];
}

const ViewPoolPage_Query = graphql(/* GraphQL */ `
  query ViewPoolPage($id: UUID!) {
    pool(id: $id) {
      ...ViewPool
    }
    departments {
      ...DuplicatePoolDepartment
    }
  }
`);

const ViewPoolPage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const { isFetching, mutations } = usePoolMutations();
  const [{ data, fetching, error }] = useQuery({
    query: ViewPoolPage_Query,
    variables: { id: poolId },
  });

  return (
    <Container className="my-18">
      <Pending fetching={fetching} error={error}>
        {poolId && data?.pool ? (
          <ViewPool
            poolQuery={data.pool}
            departmentsQuery={unpackMaybes(data?.departments)}
            isFetching={isFetching}
            onExtend={async (newClosingDate: string) => {
              return mutations.extend(poolId, newClosingDate);
            }}
            onClose={async (reason: string) => {
              return mutations.close(poolId, reason);
            }}
            onDuplicate={async ({ department }) => {
              return mutations.duplicate(poolId, department);
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
    </Container>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <ViewPoolPage />
  </RequireAuth>
);

Component.displayName = "AdminViewPoolPage";

export default Component;
