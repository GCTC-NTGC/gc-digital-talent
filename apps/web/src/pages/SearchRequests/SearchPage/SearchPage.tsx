import { defineMessage, useIntl } from "react-intl";

import { navigationMessages } from "@gc-digital-talent/i18n";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";

import SearchFormApi from "./components/SearchForm";

const pageTitle = defineMessage({
  defaultMessage: "Find digital talent",
  id: "9Jkoms",
  description: "Title displayed on hero for Search and Request pages.",
});

const subTitle = defineMessage({
  defaultMessage:
    "Discover talent using a set of comprehensive filters, including classification, languages, and skills.",
  id: "69BfF3",
  description: "Subtitle for the search page",
});

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: paths.search(),
      },
    ],
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.findTalent)}
        description={formattedSubTitle}
      />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        crumbs={crumbs}
      />
      <SearchFormApi />
    </>
  );
};

Component.displayName = "SearchPage";

export default Component;
