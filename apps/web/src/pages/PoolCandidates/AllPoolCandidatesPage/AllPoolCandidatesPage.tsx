import { useIntl } from "react-intl";
import IdentificationOutlineIcon from "@heroicons/react/24/outline/IdentificationIcon";
import IdentificationSolidIcon from "@heroicons/react/24/solid/IdentificationIcon";

import { IconType } from "@gc-digital-talent/ui";
import {
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";

export const pageOutlineIcon: IconType = IdentificationOutlineIcon;
export const pageSolidIcon: IconType = IdentificationSolidIcon;

export const AllPoolCandidatesPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.candidateSearch);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage({
          defaultMessage: "Candidates",
          id: "zzf16k",
          description: "Breadcrumb for the All Candidates page",
        }),
        url: routes.poolCandidates(),
      },
    ],
    isAdmin: true,
  });

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

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.RequestResponder,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <AllPoolCandidatesPage />
  </RequireAuth>
);

Component.displayName = "AdminAllPoolCandidatesPage";

export default AllPoolCandidatesPage;
