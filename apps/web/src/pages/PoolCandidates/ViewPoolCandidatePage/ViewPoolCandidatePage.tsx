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
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  User,
  Scalars,
  Maybe,
  graphql,
  ArmedForcesStatus,
  PoolCandidateSnapshotQuery,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import PoolStatusTable from "~/components/PoolStatusTable/PoolStatusTable";
import { getCandidateStatusChip } from "~/utils/poolCandidate";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import { getFullNameLabel } from "~/utils/nameUtils";
import AssessmentResultsTable from "~/components/AssessmentResultsTable/AssessmentResultsTable";
import ChangeStatusDialog from "~/components/CandidateDialog/ChangeStatusDialog";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import ErrorBoundary from "~/components/ErrorBoundary/ErrorBoundary";
import pageTitles from "~/messages/pageTitles";
import { JobPlacementOptionsFragmentType } from "~/components/PoolCandidatesTable/JobPlacementDialog";
import Hero from "~/components/Hero";

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
    poolCandidate(id: $poolCandidateId) {
      ...MoreActions
      ...ClaimVerification
      ...AssessmentResultsTable
      ...ChangeStatusDialog_PoolCandidate
      ...ApplicationInformation_PoolCandidate
      id
      profileSnapshot
      finalDecision {
        value
        label {
          en
          fr
        }
      }
      assessmentStatus {
        currentStep
        assessmentStepStatuses {
          decision
          step
        }
      }
      user {
        ...ApplicationProfileDetails
        ...PoolStatusTable
        ...ChangeStatusDialog_User
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
  }
`);

export interface ViewPoolCandidateProps {
  poolCandidate: NonNullable<PoolCandidateSnapshotQuery["poolCandidate"]>;
  jobPlacementOptions: JobPlacementOptionsFragmentType;
}

export const ViewPoolCandidate = ({
  poolCandidate,
  jobPlacementOptions,
}: ViewPoolCandidateProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const parsedSnapshot = JSON.parse(
    String(poolCandidate.profileSnapshot),
  ) as Maybe<User>;
  const nonEmptyExperiences = unpackMaybes(parsedSnapshot?.experiences);
  const statusChip = getCandidateStatusChip(
    poolCandidate.finalDecision,
    poolCandidate.assessmentStatus,
    intl,
  );

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
        label: intl.formatMessage(screeningAndAssessmentTitle),
        url: paths.screeningAndEvaluation(poolCandidate.pool.id),
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
            <Chip
              key="status"
              color={statusChip.color}
              data-h2-font-weight="base(700)"
            >
              {statusChip.label}
            </Chip>
            {poolCandidate.user.hasPriorityEntitlement ||
            poolCandidate.user.priorityWeight === 10 ? (
              <Chip key="priority" color="black">
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
              <Chip key="veteran" color="black">
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
      <AdminContentWrapper table>
        <Sidebar.Wrapper>
          <Sidebar.Sidebar>
            <Heading size="h3" data-h2-margin-top="base(0)">
              {intl.formatMessage({
                defaultMessage: "More actions",
                id: "QaMkP7",
                description:
                  "Title for more actions sidebar on view pool candidate page",
              })}
            </Heading>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Additional information, relevant to this candidate’s application.",
                id: "5cW3Ns",
                description:
                  "Description for more actions sidebar on view pool candidate page",
              })}
            </p>
            <MoreActions
              poolCandidate={poolCandidate}
              jobPlacementOptions={jobPlacementOptions}
            />
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-align-items="base(flex-start)"
              data-h2-gap="base(x.5)"
              data-h2-margin-bottom="base(x1)"
              data-h2-padding="base(x1)"
              data-h2-background-color="base(error.lightest.3)"
            >
              <Heading level="h3" size="h6" data-h2-margin-top="base(0)">
                {intl.formatMessage({
                  defaultMessage: "Candidate status",
                  id: "ETrCOq",
                  description:
                    "Title for admin editing a pool candidates status",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "These fields will only be available for migration purposes during a limited time.",
                  id: "FXpcgW",
                  description:
                    "Sentence to explain that status and expiry date fields are available for a specific purpose and for a limited amount of time",
                })}
              </p>
              <p>
                {intl.formatMessage(commonMessages.status)}
                {intl.formatMessage(commonMessages.dividingColon)}
                <ChangeStatusDialog
                  selectedCandidateQuery={poolCandidate}
                  user={poolCandidate.user}
                />
              </p>
            </div>
          </Sidebar.Sidebar>
          <Sidebar.Content>
            <div data-h2-margin-bottom="base(x1)">
              <Heading
                Icon={ExclamationTriangleIcon}
                color="quaternary"
                data-h2-margin="base(0, 0, x1, 0)"
              >
                {intl.formatMessage(screeningAndAssessmentTitle)}
              </Heading>
              <AssessmentResultsTable
                poolCandidateQuery={poolCandidate}
                experiences={nonEmptyExperiences}
              />
            </div>
            <ClaimVerification verificationQuery={poolCandidate} />
            {parsedSnapshot ? (
              <div data-h2-margin-top="base(x2)">
                <ErrorBoundary>
                  <ApplicationInformation
                    poolQuery={poolCandidate.pool}
                    snapshot={parsedSnapshot}
                    applicationQuery={poolCandidate}
                  />
                </ErrorBoundary>
                <div data-h2-margin="base(x2 0)">
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
                        <PoolStatusTable userQuery={poolCandidate.user} />
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion.Root>
                </div>
                <ErrorBoundary>
                  <CareerTimelineSection
                    experiences={nonEmptyExperiences ?? []}
                  />
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

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate ? (
        <ViewPoolCandidate
          poolCandidate={data.poolCandidate}
          jobPlacementOptions={data}
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
      ROLE_NAME.PoolOperator,
      ROLE_NAME.RequestResponder,
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

export default ViewPoolCandidatePage;
