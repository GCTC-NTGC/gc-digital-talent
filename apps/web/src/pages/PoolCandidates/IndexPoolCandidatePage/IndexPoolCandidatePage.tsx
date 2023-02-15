import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import SEO from "@common/components/SEO/SEO";
import Breadcrumbs from "@common/components/Breadcrumbs";
import Pending from "@common/components/Pending";
import { getFullPoolAdvertisementTitleHtml } from "@common/helpers/poolUtils";

import { Scalars, useGetPoolAdvertisementQuery } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";

type RouteParams = {
  poolId: Scalars["ID"];
};

export const IndexPoolCandidatePage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { poolId } = useParams<RouteParams>();

  const [{ data, fetching, error }] = useGetPoolAdvertisementQuery({
    variables: {
      id: poolId || "",
    },
  });

  const crumbs = [
    {
      title: intl.formatMessage({
        defaultMessage: "My Pools",
        id: "XYLd6G",
        description: "Breadcrumb for the My Pools page",
      }),
      href: paths.poolTable(),
    },
    {
      title:
        getFullPoolAdvertisementTitleHtml(intl, data?.poolAdvertisement) ||
        intl.formatMessage({
          defaultMessage: "Pool name not found",
          id: "HGMl3y",
          description: "Breadcrumb to pool page if pool name not found",
        }),
      href: data?.poolAdvertisement
        ? paths.poolView(data.poolAdvertisement.id)
        : paths.poolTable(),
    },
    {
      title: intl.formatMessage({
        defaultMessage: "All Candidates",
        id: "v8vbWP",
        description: "Breadcrumb for the All Candidates page",
      }),
    },
  ];

  return (
    <Pending fetching={fetching} error={error}>
      <SEO
        title={intl.formatMessage({
          id: "EHVt0j",
          defaultMessage: "Pool Candidates",
          description:
            "Title displayed above the Pool Candidate Table component.",
        })}
      />
      <Breadcrumbs links={crumbs} />
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
  );
};

export default IndexPoolCandidatePage;
