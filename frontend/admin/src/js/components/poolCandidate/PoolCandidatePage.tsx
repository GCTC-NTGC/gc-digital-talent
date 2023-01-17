import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import PageHeader from "@common/components/PageHeader";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import Breadcrumbs from "@common/components/Breadcrumbs";
import Pending from "@common/components/Pending";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";

import DashboardContentContainer from "../DashboardContentContainer";
import PoolCandidatesTable from "./PoolCandidatesTable";
import { useAdminRoutes } from "../../adminRoutes";
import { Scalars, useGetPoolAdvertisementQuery } from "../../api/generated";

type RouteParams = {
  poolId: Scalars["ID"];
};

export const PoolCandidatePage = () => {
  const intl = useIntl();
  const paths = useAdminRoutes();
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
        getFullPoolAdvertisementTitle(intl, data?.poolAdvertisement) ||
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
      <div
        data-h2-background-color="base(dt-gray.light)"
        data-h2-padding="base(x1, x1, x1, x1)"
      >
        <Breadcrumbs links={crumbs} />
      </div>
      <DashboardContentContainer>
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
              poolName: getFullPoolAdvertisementTitle(
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
      </DashboardContentContainer>
    </Pending>
  );
};

export default PoolCandidatePage;
