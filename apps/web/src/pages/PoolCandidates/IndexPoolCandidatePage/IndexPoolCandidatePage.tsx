import React from "react";
import { useIntl } from "react-intl";

import { Pending } from "@gc-digital-talent/ui";

import {
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  Scalars,
  useGetPoolQuery,
} from "~/api/generated";
import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import useRequiredParams from "~/hooks/useRequiredParams";

type RouteParams = {
  poolId: Scalars["ID"];
};

export const IndexPoolCandidatePage = () => {
  const intl = useIntl();
  const { poolId } = useRequiredParams<RouteParams>("poolId");

  const pageTitle = intl.formatMessage(adminMessages.poolsCandidates);

  const [{ data, fetching, error }] = useGetPoolQuery({
    variables: {
      id: poolId,
    },
  });

  return (
    <AdminContentWrapper>
      <SEO title={pageTitle} />
      <Pending fetching={fetching} error={error}>
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "This table shows a list of all applicants to this pool.",
            id: "0a8nPa",
            description:
              "Descriptive text about the list of pool candidates in the admin portal.",
          })}
        </p>
        <PoolCandidatesTable
          initialFilterInput={{
            applicantFilter: { pools: [{ id: poolId || "" }] },
            suspendedStatus: CandidateSuspendedFilter.Active,
            expiryStatus: CandidateExpiryFilter.Active,
          }}
          currentPool={data?.pool}
          title={pageTitle}
        />
      </Pending>
    </AdminContentWrapper>
  );
};

export default IndexPoolCandidatePage;
