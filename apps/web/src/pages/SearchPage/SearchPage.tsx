import * as React from "react";
import { useIntl } from "react-intl";

import SEO from "@common/components/SEO/SEO";

import SearchContainer from "./SearchContainer";
import SearchHeading from "./SearchHeading";

const SearchPage = () => {
  const intl = useIntl();

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Search pools",
          id: "E2HkVa",
          description: "Page title for the search page",
        })}
      />
      <section data-h2-background-color="base(gray.15)">
        <SearchHeading />
        <SearchContainer />
      </section>
    </>
  );
};

export default SearchPage;
