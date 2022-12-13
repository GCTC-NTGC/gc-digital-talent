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
          id: "WPkc5j",
          description: "Page title for page",
        })}
      />
      <section data-h2-background-color="base(dt-gray.15)">
        <SearchHeading />
        <SearchContainer />
      </section>
    </>
  );
};

export default SearchPage;
