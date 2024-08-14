import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import {
  graphql,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  Scalars,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

type RouteParams = {
  poolId: Scalars["ID"]["output"];
};

const IndexPoolCandidatePage_Query = graphql(/* GraphQL */ `
  query IndexPoolCandidatePage($id: UUID!) {
    pool(id: $id) {
      id
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
    <AdminContentWrapper>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Talent placement",
          id: "0YpfAG",
          description: "Title for candidates tab for a process",
        })}
        description={formattedSubTitle}
      />
      <Pending fetching={fetching} error={error}>
        <p data-h2-margin="base(x1, 0)">{formattedSubTitle}</p>
        <PoolCandidatesTable
          hidePoolFilter
          initialFilterInput={{
            applicantFilter: { pools: [{ id: poolId || "" }] },
            suspendedStatus: CandidateSuspendedFilter.Active,
            expiryStatus: CandidateExpiryFilter.Active,
          }}
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
    </AdminContentWrapper>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.RequestResponder,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <IndexPoolCandidatePage />
  </RequireAuth>
);

Component.displayName = "AdminPoolCandidatePage";

export default IndexPoolCandidatePage;
