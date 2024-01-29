import * as React from "react";
import { useIntl } from "react-intl";

import { navigationMessages } from "@gc-digital-talent/i18n";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";

import SearchFormApi from "./components/SearchForm";

const SearchPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const title = intl.formatMessage({
    defaultMessage: "Find digital talent",
    id: "9Jkoms",
    description: "Title displayed on hero for Search and Request pages.",
  });

  const crumbs = useBreadcrumbs([
    {
      label: title,
      url: paths.search(),
    },
  ]);

  return (
    <>
      <SEO title={intl.formatMessage(navigationMessages.findTalent)} />
      <Hero
        title={title}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Discover talent using a set of comprehensive filters, including classification, languages, and skills.",
          id: "69BfF3",
          description: "Subtitle for the search page",
        })}
        crumbs={crumbs}
      />
      <SearchFormApi />
    </>
  );
};

export default SearchPage;
