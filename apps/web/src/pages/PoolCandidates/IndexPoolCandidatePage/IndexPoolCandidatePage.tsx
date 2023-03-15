import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import { Pending } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { Scalars, useGetPoolAdvertisementQuery } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

type RouteParams = {
  poolId: Scalars["ID"];
};

export const IndexPoolCandidatePage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { poolId } = useParams<RouteParams>();

  const [{ data, fetching, error }] = useGetPoolAdvertisementQuery({
    variables: {
      id: poolId || "",
    },
  });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "DUK/pz",
        description: "Breadcrumb title for the home page link.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Pools",
        id: "3fAkvM",
        description: "Breadcrumb title for the pools page link.",
      }),
      url: routes.poolTable(),
    },
    ...(poolId
      ? [
          {
            label: getLocalizedName(data?.poolAdvertisement?.name, intl),
            url: routes.poolView(poolId),
          },
        ]
      : []),
    ...(data?.poolAdvertisement?.id
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Candidates",
              id: "zzf16k",
              description: "Breadcrumb for the All Candidates page",
            }),
            url: routes.poolCandidateTable(data.poolAdvertisement.id),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending fetching={fetching} error={error}>
        <SEO
          title={intl.formatMessage({
            id: "EHVt0j",
            defaultMessage: "Pool Candidates",
            description:
              "Title displayed above the Pool Candidate Table component.",
          })}
        />
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "This table shows a list of all applicants to this pool. Use the review button to manage an applicant.",
            id: "drwKS5",
            description:
              "Descriptive text about the list of pool candidates in the admin portal.",
          })}
        </p>
        <PoolCandidatesTable
          initialFilterInput={{
            applicantFilter: { pools: [{ id: poolId || "" }] },
          }}
          currentPool={data?.poolAdvertisement}
        />
      </Pending>
    </AdminContentWrapper>
  );
};

export default IndexPoolCandidatePage;
