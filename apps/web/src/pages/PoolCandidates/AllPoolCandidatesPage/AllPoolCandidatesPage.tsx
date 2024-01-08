import React from "react";
import { useIntl } from "react-intl";

import useRoutes from "~/hooks/useRoutes";
import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import {
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
} from "~/api/generated";
import AdminHero from "~/components/Hero/AdminHero";

import { pageTitle } from "./navigation";

export const AllPoolCandidatesPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);

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
      label: intl.formatMessage({
        defaultMessage: "Candidates",
        id: "zzf16k",
        description: "Breadcrumb for the All Candidates page",
      }),
      url: routes.poolCandidates(),
    },
  ];

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <PoolCandidatesTable
          title={formattedPageTitle}
          initialFilterInput={{
            suspendedStatus: CandidateSuspendedFilter.Active,
            expiryStatus: CandidateExpiryFilter.Active,
          }}
        />
      </AdminContentWrapper>
    </>
  );
};

export default AllPoolCandidatesPage;
