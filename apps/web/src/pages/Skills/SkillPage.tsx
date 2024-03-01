import React from "react";
import { MessageDescriptor, defineMessage, useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero";

import SkillTableApi from "./components/SkillTable";

export const pageTitle: MessageDescriptor = defineMessage({
  defaultMessage: "Skills",
  id: "o2wisD",
  description: "Title for explore skills page",
});
export const pageSubtitle: MessageDescriptor = defineMessage({
  defaultMessage: "Explore all the skills on our site.",
  id: "eTOg2E",
  description: "Subtitle for explore skills page",
});

export const SkillPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedPageSubtitle = intl.formatMessage(pageSubtitle);

  const crumbs = [
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
      url: routes.skills(),
    },
  ];

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedPageSubtitle}
        crumbs={crumbs}
      />
      <section
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-margin="base(x3)"
      >
        <SkillTableApi title={formattedPageTitle} />
      </section>
    </>
  );
};

export default SkillPage;
