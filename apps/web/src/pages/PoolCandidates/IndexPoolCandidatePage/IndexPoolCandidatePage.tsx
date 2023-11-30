import React from "react";
import { useIntl } from "react-intl";

import { Pending } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { Scalars, useGetPoolQuery } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
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
  const routes = useRoutes();
  const { poolId } = useRequiredParams<RouteParams>("poolId");

  const pageTitle = intl.formatMessage(adminMessages.poolsCandidates);

  const [{ data, fetching, error }] = useGetPoolQuery({
    variables: {
      id: poolId,
    },
  });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
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
    ...(data?.pool?.id
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Candidates",
              id: "zzf16k",
              description: "Breadcrumb for the All Candidates page",
            }),
            url: routes.poolCandidateTable(data.pool.id),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending fetching={fetching} error={error}>
        <SEO title={pageTitle} />
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
          }}
          currentPool={data?.pool}
          title={pageTitle}
        />
      </Pending>
    </AdminContentWrapper>
  );
};

export default IndexPoolCandidatePage;
