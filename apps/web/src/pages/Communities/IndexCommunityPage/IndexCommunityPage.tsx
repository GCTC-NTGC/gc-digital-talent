import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { requireUser } from "~/routing/auth";

import type { Route } from "./+types/IndexCommunityPage";
import CommunityTableApi from "./components/CommunityTable/CommunityTable";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }, next) => {
    requireUser(context, request, {
      roles: [
        { name: ROLE_NAME.PlatformAdmin },
        { name: ROLE_NAME.CommunityAdmin },
        { name: ROLE_NAME.CommunityRecruiter },
        { name: ROLE_NAME.CommunityTalentCoordinator },
      ],
    });
    return await next();
  },
];

const Component = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.communities);
  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.communityTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper table>
        <CommunityTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

Component.displayName = "AdminIndexCommunityPage";

export default Component;
