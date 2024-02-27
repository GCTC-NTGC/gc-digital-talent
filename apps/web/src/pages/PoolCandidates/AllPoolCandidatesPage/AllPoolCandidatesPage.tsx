import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import IdentificationOutlineIcon from "@heroicons/react/24/outline/IdentificationIcon";
import IdentificationSolidIcon from "@heroicons/react/24/solid/IdentificationIcon";

import { IconType } from "@gc-digital-talent/ui";
import {
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Candidate search",
  id: "i16C7G",
  description: "Title for the all pool candidates page",
});
export const pageOutlineIcon: IconType = IdentificationOutlineIcon;
export const pageSolidIcon: IconType = IdentificationSolidIcon;

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
          doNotUseBookmark
        />
      </AdminContentWrapper>
    </>
  );
};

export default AllPoolCandidatesPage;
