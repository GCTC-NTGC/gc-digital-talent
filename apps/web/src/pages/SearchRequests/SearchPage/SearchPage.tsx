import * as React from "react";
import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";

import SearchContainer from "./components/SearchContainer";
import SearchHeading from "./components/SearchHeading";

const SearchPage = () => {
  const intl = useIntl();

  return (
    <div>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Find talent",
          id: "ccBhi2",
          description: "Page title for the search page",
        })}
      />
      <SearchHeading />
      <SearchContainer />
    </div>
  );
};

export default SearchPage;
