import * as React from "react";
import { SearchContainerApi } from "./SearchContainer";
import SearchHeading from "./SearchHeading";

const SearchPage: React.FunctionComponent = () => {
  return (
    <section>
      <SearchHeading />
      <SearchContainerApi />
    </section>
  );
};

export default SearchPage;
