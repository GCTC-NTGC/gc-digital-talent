import { useIntl } from "react-intl";

import {
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import PoolCandidatesTable from "~/components/PoolCandidatesTable/PoolCandidatesTable";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/HeroDeprecated/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";

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
