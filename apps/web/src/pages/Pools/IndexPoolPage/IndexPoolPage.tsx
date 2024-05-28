import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import SquaresPlusOutlineIcon from "@heroicons/react/24/outline/SquaresPlusIcon";
import SquaresPlusSolidIcon from "@heroicons/react/24/solid/SquaresPlusIcon";

import { IconType } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import PoolTableApi from "./components/PoolTable";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Processes",
  id: "Mi+AuD",
  description: "Title for the index pool page",
});
export const pageOutlineIcon: IconType = SquaresPlusOutlineIcon;
export const pageSolidIcon: IconType = SquaresPlusSolidIcon;

export const PoolPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.poolTable(),
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
        <PoolTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <PoolPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexPoolPage";

export default PoolPage;
