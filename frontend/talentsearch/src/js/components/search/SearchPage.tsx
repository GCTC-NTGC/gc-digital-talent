import * as React from "react";
import { useIntl } from "react-intl";

import SEO from "@common/components/SEO/SEO";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";

import { SearchContainerApi as OldSearchContainerApi } from "./deprecated/SearchContainer";
import SearchContainerApi from "./SearchContainer";
import SearchHeading from "./SearchHeading";

const SearchPage = () => {
  const intl = useIntl();
  const SearchContainer = checkFeatureFlag("FEATURE_APPLICANTSEARCH")
    ? SearchContainerApi
    : OldSearchContainerApi;
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
