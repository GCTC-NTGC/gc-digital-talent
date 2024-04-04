import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import BoltOutlineIcon from "@heroicons/react/24/outline/BoltIcon";
import BoltSolidIcon from "@heroicons/react/24/solid/BoltIcon";

import { IconType } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import SkillTableApi from "./components/SkillTable";
import AdminHero from "../../components/Hero/AdminHero";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Skills",
  id: "/UKT+/",
  description: "Title for skills",
});
export const pageSolidIcon: IconType = BoltSolidIcon;
export const pageOutlineIcon: IconType = BoltOutlineIcon;

export const IndexSkillPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.skillTable(),
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
        <SkillTableApi title={formattedPageTitle} addButton />
      </AdminContentWrapper>
    </>
  );
};

export default IndexSkillPage;
