import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import adminMessages from "~/messages/adminMessages";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import CommunityTalentTable from "./CommunityTalentTable";

export const CommunityTalentPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage(adminMessages.communityTalent);
  const pageSubtitle = intl.formatMessage({
    defaultMessage:
      "Find GC employees interested in talent mobility opportunities within your community.",
    id: "rT35R+",
    description: "Subtitle explaining the community talent table",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.communityTalentPage(),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} description={pageSubtitle} />
      <Hero title={pageTitle} subtitle={pageSubtitle} crumbs={crumbs} />
      <AdminContentWrapper table>
        <CommunityTalentTable title={pageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityTalentCoordinator,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <CommunityTalentPage />
  </RequireAuth>
);

Component.displayName = "CommunityTalentPage";

export default Component;
