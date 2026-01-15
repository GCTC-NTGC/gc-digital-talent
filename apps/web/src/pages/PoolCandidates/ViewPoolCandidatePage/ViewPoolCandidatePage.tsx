import { defineMessage, useIntl } from "react-intl";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import { OperationContext, useQuery } from "urql";

import {
  NotFound,
  Pending,
  Accordion,
  Heading,
  Sidebar,
  Chip,
  Chips,
} from "@gc-digital-talent/ui";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  User,
  Scalars,
  Maybe,
  graphql,
  ArmedForcesStatus,
  PoolCandidateSnapshotQuery,
  FragmentType,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import PoolStatusTable from "~/components/PoolStatusTable/PoolStatusTable";
import { getApplicationStatusChip } from "~/utils/poolCandidate";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import { getFullNameLabel } from "~/utils/nameUtils";
import AssessmentResultsTable from "~/components/AssessmentResultsTable/AssessmentResultsTable";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import ErrorBoundary from "~/components/ErrorBoundary/ErrorBoundary";
import pageTitles from "~/messages/pageTitles";
import { JobPlacementOptionsFragmentType } from "~/components/PoolCandidateDialogs/JobPlacementForm";
import Hero from "~/components/Hero";
import { FlexibleWorkLocationOptions_Fragment } from "~/components/Profile/components/WorkPreferences/fragment";

import CareerTimelineSection from "./components/CareerTimelineSection/CareerTimelineSection";
import ApplicationInformation from "./components/ApplicationInformation/ApplicationInformation";
import ProfileDetails from "./components/ProfileDetails/ProfileDetails";
import MoreActions from "./components/MoreActions/MoreActions";
import ClaimVerification from "./components/ClaimVerification/ClaimVerification";

const screeningAndAssessmentTitle = defineMessage({
  defaultMessage: "Screening and assessment",
  id: "R8Naqm",
  description: "Heading for the information of an application",
});

const PoolCandidate_SnapshotQuery = graphql(/* GraphQL */ `
  query PoolCandidateSnapshot($poolCandidateId: UUID!) {
    ...JobPlacementOptions
    me {
      poolCandidateBookmarks {
        id
      }
    }
    poolCandidate(id: $poolCandidateId) {
      ...MoreActions
      ...ClaimVerification
      ...AssessmentResultsTable
      ...ApplicationInformation_PoolCandidate
      id
      profileSnapshot
      status {
        value
        label {
          localized
        }
      }
      assessmentStep {
        sortOrder
      }
      assessmentStatus {
        assessmentStepStatuses {
          decision
          step
        }
      }
      user {
        ...ApplicationProfileDetails
        ...PoolStatusTable
        firstName
        lastName
        hasPriorityEntitlement
        priorityWeight
        armedForcesStatus {
          value
          label {
            en
            fr
          }
        }
      }
      pool {
        ...ApplicationInformation_PoolFragment
        id
        processNumber
        name {
          en
          fr
        }
        classification {
          id
          group
          level
        }
        workStream {
          id
          name {
            en
            fr
          }
        }
        publishingGroup {
          value
          label {
            en
            fr
          }
        }
      }
    }
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
    ...FlexibleWorkLocationOptionsFragment
  }
`);

export interface ViewPoolCandidateProps {
  poolCandidate: NonNullable<PoolCandidateSnapshotQuery["poolCandidate"]>;
  jobPlacementOptions: JobPlacementOptionsFragmentType;
  flexibleWorkLocationOptions: FragmentType<
    typeof FlexibleWorkLocationOptions_Fragment
  >;
  usersPoolCandidateBookmarks: string[];
}

export const ViewPoolCandidate = ({
  poolCandidate,
  jobPlacementOptions,
  flexibleWorkLocationOptions,
  usersPoolCandidateBookmarks,
}: ViewPoolCandidateProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const parsedSnapshot = JSON.parse(
    String(poolCandidate.profileSnapshot),
  ) as Maybe<User>;
  const nonEmptyExperiences = unpackMaybes(parsedSnapshot?.experiences);
  const statusChip = getApplicationStatusChip(poolCandidate.status, intl);

  const candidateName = getFullNameLabel(
    poolCandidate.user.firstName,
    poolCandidate.user.lastName,
    intl,
  );

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.processes),
        url: paths.poolTable(),
      },
      {
        label: getFullPoolTitleLabel(intl, {
          workStream: poolCandidate.pool.workStream,
          name: poolCandidate.pool.name,
          publishingGroup: poolCandidate.pool.publishingGroup,
          classification: poolCandidate.pool.classification,
        }),
        url: paths.poolView(poolCandidate.pool.id),
      },
      {
        label: intl.formatMessage(navigationMessages.candidates),
        url: paths.poolCandidateTable(poolCandidate.pool.id),
      },
      {
        label: candidateName,
        url: paths.poolCandidateApplication(poolCandidate.id),
      },
    ],
  });

  return (
    <>
      <Hero
        title={candidateName}
        crumbs={navigationCrumbs}
        status={
          <Chips>
            <Chip key="status" color={statusChip.color}>
              {statusChip.label}
            </Chip>
            {poolCandidate.user.hasPriorityEntitlement ||
            poolCandidate.user.priorityWeight === 10 ? (
              <Chip key="priority" color="gray">
                {intl.formatMessage({
                  defaultMessage: "Priority",
                  id: "xGMcBO",
                  description: "Label for priority chip on view candidate page",
                })}
              </Chip>
            ) : null}
            {poolCandidate.user.armedForcesStatus?.value ===
              ArmedForcesStatus.Veteran ||
            poolCandidate.user.priorityWeight === 20 ? (
              <Chip key="veteran" color="gray">
                {intl.formatMessage({
                  defaultMessage: "Veteran",
                  id: "16iCWc",
                  description: "Label for veteran chip on view candidate page",
                })}
              </Chip>
            ) : null}
          </Chips>
        }
        additionalContent={<ProfileDetails userQuery={poolCandidate.user} />}
      />
      <AdminContentWrapper table overflowScrollbar>
        <Sidebar.Wrapper scrollbar>
          <Sidebar.Sidebar scrollbar>
            <MoreActions
              poolCandidate={poolCandidate}
              jobPlacementOptions={jobPlacementOptions}
              usersPoolCandidateBookmarks={usersPoolCandidateBookmarks}
            />
          </Sidebar.Sidebar>
          <Sidebar.Content>
            <Heading
              icon={ExclamationTriangleIcon}
              color="warning"
              className="mt-0 mb-6 items-center"
              level="h2"
              size="h3"
            >
              {intl.formatMessage(screeningAndAssessmentTitle)}
            </Heading>
            <AssessmentResultsTable poolCandidateQuery={poolCandidate} />

            <ClaimVerification verificationQuery={poolCandidate} />
            {parsedSnapshot ? (
              <div className="mt-12">
                <ErrorBoundary>
                  <ApplicationInformation
                    poolQuery={poolCandidate.pool}
                    snapshot={parsedSnapshot}
                    applicationQuery={poolCandidate}
                    optionsQuery={flexibleWorkLocationOptions}
                  />
                </ErrorBoundary>
                <div className="my-12">
                  <Accordion.Root type="single" mode="card" collapsible>
                    <Accordion.Item value="otherRecruitments">
                      <Accordion.Trigger>
                        {intl.formatMessage({
                          defaultMessage: "Other processes",
                          id: "n+/HPL",
                          description:
                            "Heading for table of a users other applications and recruitments",
                        })}
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <PoolStatusTable
                          currentPoolId={poolCandidate.pool.id}
                          userQuery={poolCandidate.user}
                        />
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion.Root>
                </div>
                <ErrorBoundary>
                  <CareerTimelineSection experiences={nonEmptyExperiences} />
                </ErrorBoundary>
              </div>
            ) : (
              <NotFound
                headingMessage={intl.formatMessage(commonMessages.notFound)}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Profile snapshot not found.",
                    id: "JH2+tK",
                    description:
                      "Message displayed for profile snapshot not found.",
                  })}
                </p>
              </NotFound>
            )}
          </Sidebar.Content>
        </Sidebar.Wrapper>
      </AdminContentWrapper>
    </>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["AssessmentResult"],
};

interface RouteParams extends Record<string, string> {
  poolId: Scalars["ID"]["output"];
  poolCandidateId: Scalars["ID"]["output"];
}

export const ViewPoolCandidatePage = () => {
  const intl = useIntl();
  const { poolCandidateId } = useRequiredParams<RouteParams>("poolCandidateId");
  const [{ data, fetching, error }] = useQuery({
    query: PoolCandidate_SnapshotQuery,
    context,
    variables: { poolCandidateId },
  });

  const browsingUsersCandidateBookmarks = unpackMaybes(
    data?.me?.poolCandidateBookmarks,
  ).map((candidate) => candidate.id);

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate ? (
        <ViewPoolCandidate
          poolCandidate={data.poolCandidate}
          jobPlacementOptions={data}
          flexibleWorkLocationOptions={data}
          usersPoolCandidateBookmarks={browsingUsersCandidateBookmarks}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Candidate {poolCandidateId} not found.",
                id: "GrfidX",
                description: "Message displayed for pool candidate not found.",
              },
              { poolCandidateId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
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
    <ViewPoolCandidatePage />
  </RequireAuth>
);

Component.displayName = "AdminViewPoolCandidatePage";

export default Component;
