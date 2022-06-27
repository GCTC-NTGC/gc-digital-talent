import * as React from "react";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";

import { SearchContainerApi as OldSearchContainerApi } from "./deprecated/SearchContainer";
import SearchContainerApi from "./SearchContainer";
import SearchHeading from "./SearchHeading";

const SearchPage: React.FunctionComponent = () => {
  const SearchContainer = checkFeatureFlag("FEATURE_APPLICANTSEARCH")
    ? SearchContainerApi
    : OldSearchContainerApi;
  return (
    <section>
      <SearchHeading />
      <SearchContainer />
    </section>
  );
};

export default SearchPage;
