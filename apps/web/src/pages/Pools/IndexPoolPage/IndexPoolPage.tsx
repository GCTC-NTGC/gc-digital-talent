import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import SquaresPlusOutlineIcon from "@heroicons/react/24/outline/SquaresPlusIcon";
import SquaresPlusSolidIcon from "@heroicons/react/24/solid/SquaresPlusIcon";

import { IconType } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";

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
      url: routes.poolTable(),
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
        <PoolTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default PoolPage;
