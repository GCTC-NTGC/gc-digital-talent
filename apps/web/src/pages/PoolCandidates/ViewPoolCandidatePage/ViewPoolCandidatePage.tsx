import { defineMessage, useIntl } from "react-intl";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import type { OperationContext } from "urql";
import { useQuery } from "urql";

import { NotFound, Pending, Heading, Sidebar } from "@gc-digital-talent/ui";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import type { PoolCandidateSnapshotQuery } from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import PoolStatusTable from "~/components/PoolStatusTable/PoolStatusTable";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import { getFullNameLabel } from "~/utils/nameUtils";
import AssessmentResultsTable from "~/components/AssessmentResultsTable/AssessmentResultsTable";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import ApplicationSnapshot from "~/components/ApplicationSnapshot/ApplicationSnapshot";

import ClaimVerification from "./components/ClaimVerification/ClaimVerification";
import ApplicationSidebar from "./components/Sidebar/ApplicationSidebar";
import ApplicationDownloadButton from "./components/Sidebar/ApplicationDownloadButton";

const screeningAndAssessmentTitle = defineMessage({
  defaultMessage: "Screening and assessment",
  id: "R8Naqm",
  description: "Heading for the information of an application",
});

const PoolCandidate_SnapshotQuery = graphql(/* GraphQL */ `
  query PoolCandidateSnapshot($poolCandidateId: UUID!) {
    poolCandidate(id: $poolCandidateId) {
      ...ApplicationSidebar

      ...ClaimVerification
      ...AssessmentResultsTable
      ...ApplicationSnapshot
      ...ApplicationDownloadButton

      id
      profileSnapshot
      applicationStatusData {
        status {
          value
          label {
            localized
          }
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
        id
        processNumber
        name {
          en
          fr
        }
        classification {
          groupAndLevel
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
}

export const ViewPoolCandidate = ({
  poolCandidate,
}: ViewPoolCandidateProps) => {
  const intl = useIntl();
  const paths = useRoutes();

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
      <Hero title={candidateName} crumbs={navigationCrumbs} />
      <AdminContentWrapper table overflowScrollbar>
        <Sidebar.Wrapper scrollbar>
          <Sidebar.Sidebar scrollbar>
            <ApplicationSidebar query={poolCandidate} />
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
            <ApplicationSnapshot
              query={poolCandidate}
              actions={
                poolCandidate && (
                  <ApplicationDownloadButton query={poolCandidate} />
                )
              }
            />
            <PoolStatusTable
              currentPoolId={poolCandidate.pool.id}
              userQuery={poolCandidate.user}
            />
          </Sidebar.Content>
        </Sidebar.Wrapper>
      </AdminContentWrapper>
    </>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["AssessmentResult", "PoolCandidate"],
};

interface RouteParams extends Record<string, string> {
  poolId: string;
  poolCandidateId: string;
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
        <ViewPoolCandidate poolCandidate={data.poolCandidate} />
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
      ROLE_NAME.DepartmentAdmin,
      ROLE_NAME.DepartmentHRAdvisor,
    ]}
  >
    <ViewPoolCandidatePage />
  </RequireAuth>
);

Component.displayName = "AdminViewPoolCandidatePage";

export default Component;
