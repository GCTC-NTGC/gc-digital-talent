import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";

import { Container, Pending } from "@gc-digital-talent/ui";
import {
  graphql,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  Scalars,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import adminMessages from "~/messages/adminMessages";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

interface RouteParams extends Record<string, string> {
  poolId: Scalars["ID"]["output"];
}

const IndexPoolCandidatePage_Query = graphql(/* GraphQL */ `
  query IndexPoolCandidatePage($id: UUID!) {
    pool(id: $id) {
      id
      assessmentSteps {
        id
        sortOrder
        title {
          localized
        }
        type {
          value
          label {
            localized
          }
        }
      }
    }
  }
`);

const subTitle = defineMessage({
  defaultMessage: "This table shows a list of all applicants to this process.",
  id: "Evn5Mo",
  description:
    "Descriptive text about the list of pool candidates in the admin portal.",
});

export const IndexPoolCandidatePage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");

  const pageTitle = intl.formatMessage(adminMessages.poolCandidates);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const [{ data, fetching, error }] = useQuery({
    query: IndexPoolCandidatePage_Query,
    variables: {
      id: poolId,
    },
  });

  const currentPool = data?.pool ?? null;

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Candidates",
          id: "YFEaeG",
          description: "Title for candidates tab for a process",
        })}
        description={formattedSubTitle}
      />
      <Container className="my-18" size="full">
        <Pending fetching={fetching} error={error}>
          <PoolCandidatesTable
            hidePoolFilter
            initialFilterInput={{
              applicantFilter: { pools: [{ id: poolId || "" }] },
              suspendedStatus: CandidateSuspendedFilter.Active,
              expiryStatus: CandidateExpiryFilter.Active,
            }}
            availableSteps={unpackMaybes(currentPool?.assessmentSteps)}
            currentPool={
              currentPool
                ? {
                    id: currentPool.id,
                  }
                : null
            }
            title={pageTitle}
          />
        </Pending>
      </Container>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <IndexPoolCandidatePage />
  </RequireAuth>
);

Component.displayName = "AdminPoolCandidatePage";

export default Component;
