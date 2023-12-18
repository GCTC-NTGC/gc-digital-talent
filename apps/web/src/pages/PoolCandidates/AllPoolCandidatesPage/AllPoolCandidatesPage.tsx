import React from "react";
import { useIntl } from "react-intl";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import useRoutes from "~/hooks/useRoutes";
import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import PageHeader from "~/components/PageHeader";
import {
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
} from "~/api/generated";

export const AllPoolCandidatesPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage(adminMessages.poolsCandidates);

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
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={IdentificationIcon}>{pageTitle}</PageHeader>
      <PoolCandidatesTable
        title={pageTitle}
        initialFilterInput={{
          suspendedStatus: CandidateSuspendedFilter.Active,
          expiryStatus: CandidateExpiryFilter.Active,
        }}
      />
    </AdminContentWrapper>
  );
};

export default AllPoolCandidatesPage;
