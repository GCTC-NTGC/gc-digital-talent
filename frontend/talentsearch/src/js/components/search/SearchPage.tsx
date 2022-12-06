import * as React from "react";

import SearchContainerApi from "./SearchContainer";
import SearchHeading from "./SearchHeading";

const SearchPage = () => (
  <section data-h2-background-color="base(dt-gray.15)">
    <SearchHeading />
    <SearchContainerApi />
  </section>
);

export default SearchPage;
