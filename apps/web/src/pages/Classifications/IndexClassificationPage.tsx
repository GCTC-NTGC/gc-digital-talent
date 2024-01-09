import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import TagOutlineIcon from "@heroicons/react/24/outline/TagIcon";
import TagSolidIcon from "@heroicons/react/24/solid/TagIcon";

import { IconType } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import AdminHero from "~/components/Hero/AdminHero";

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
      label: formattedPageTitle,
      url: routes.classificationTable(),
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
        <ClassificationTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default IndexClassificationPage;
