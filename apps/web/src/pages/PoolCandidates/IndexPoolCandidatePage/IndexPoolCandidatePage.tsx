import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

import { Breadcrumbs, Pending } from "@gc-digital-talent/ui";

import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import { Scalars, useGetPoolAdvertisementQuery } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import PageHeader from "~/components/PageHeader";

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
      label: intl.formatMessage({
        defaultMessage: "My Pools",
        id: "XYLd6G",
        description: "Breadcrumb for the My Pools page",
      }),
      url: paths.poolTable(),
    },
    {
      label:
        getFullPoolAdvertisementTitleHtml(intl, data?.poolAdvertisement) ||
        intl.formatMessage({
          defaultMessage: "Pool name not found",
          id: "HGMl3y",
          description: "Breadcrumb to pool page if pool name not found",
        }),
      url: data?.poolAdvertisement
        ? paths.poolView(data.poolAdvertisement.id)
        : paths.poolTable(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "All Candidates",
        id: "v8vbWP",
        description: "Breadcrumb for the All Candidates page",
      }),
      url: data?.poolAdvertisement
        ? paths.poolCandidateTable(data?.poolAdvertisement.id)
        : "#",
    },
  ];

  return (
    <Pending fetching={fetching} error={error}>
      <div
        data-h2-background-color="base(dt-gray.light)"
        data-h2-padding="base(x1, x1, x1, x1)"
      >
        <Breadcrumbs crumbs={crumbs} />
      </div>
      <PageHeader
        icon={Squares2X2Icon}
        subtitle={intl.formatMessage(
          {
            defaultMessage: "From {poolName}",
            id: "RDgQ0h",
            description:
              "Subtitle on pool candidates page indicating which pool candidates are from",
          },
          {
            poolName: getFullPoolAdvertisementTitleHtml(
              intl,
              data?.poolAdvertisement,
            ),
          },
        )}
      >
        {intl.formatMessage({
          id: "EHVt0j",
          defaultMessage: "Pool Candidates",
          description:
            "Title displayed above the Pool Candidate Table component.",
        })}
      </PageHeader>
      <p>
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
