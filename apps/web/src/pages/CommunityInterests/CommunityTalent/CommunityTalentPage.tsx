import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

export const CommunityTalentPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Community talent",
    id: "ZPkrJh",
    description: "aaa",
  });
  const pageSubtitle = intl.formatMessage({
    defaultMessage:
      "Find GC employees interested in talent mobility opportunities within your community.",
    id: "3fMyIh",
    description: "aaa",
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
      <section
        data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-margin="base(x3)"
      >
        <p>Hi</p>
      </section>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin]}>
    <CommunityTalentPage />
  </RequireAuth>
);

Component.displayName = "CommunityTalentPage";

export default CommunityTalentPage;
