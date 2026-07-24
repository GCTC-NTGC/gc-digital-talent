import { useIntl } from "react-intl";

import { Container } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import TalentRequestTable from "./components/TalentRequestTable/TalentRequestTable";

const IndexTalentRequestPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage(pageTitles.talentRequests);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.searchRequestTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <Container size="full" className="my-18 sm:px-12">
        <TalentRequestTable title={pageTitle} />
      </Container>
    </>
  );
};

const Component = () => {
  return (
    <RequireAuth
      roles={[
        ROLE_NAME.CommunityRecruiter,
        ROLE_NAME.CommunityAdmin,
        ROLE_NAME.PlatformAdmin,
      ]}
    >
      <IndexTalentRequestPage />
    </RequireAuth>
  );
};

Component.displayName = "IndexTalentRequestPage";

export default Component;
