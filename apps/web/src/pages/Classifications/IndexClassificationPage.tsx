import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import TagOutlineIcon from "@heroicons/react/24/outline/TagIcon";
import TagSolidIcon from "@heroicons/react/24/solid/TagIcon";

import { IconType } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import AdminHero from "~/components/Hero/AdminHero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ClassificationTableApi from "./components/ClassificationTable";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Classifications",
  id: "kvpRgN",
  description: "Title for classifications",
});
export const pageOutlineIcon: IconType = TagOutlineIcon;
export const pageSolidIcon: IconType = TagSolidIcon;

export const IndexClassificationPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.classificationTable(),
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
        <ClassificationTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <IndexClassificationPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexClassificationPage";

export default IndexClassificationPage;
