import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";
import CloudOutlineIcon from "@heroicons/react/24/outline/CloudIcon";
import CloudSolidIcon from "@heroicons/react/24/solid/CloudIcon";

import { IconType } from "@gc-digital-talent/ui";

import AdminHero from "~/components/Hero/AdminHero";
import SEO from "~/components/SEO/SEO";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";

import SkillFamilyTableApi from "./components/SkillFamilyTable";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Skill families",
  id: "0E9hiS",
  description: "Title for skill families",
});
export const pageOutlineIcon: IconType = CloudOutlineIcon;
export const pageSolidIcon: IconType = CloudSolidIcon;

const IndexSkillFamilyPage = () => {
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
      url: routes.skillFamilyTable(),
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
        <SkillFamilyTableApi title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default IndexSkillFamilyPage;
