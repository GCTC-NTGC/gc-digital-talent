import React from "react";
import { storiesOf } from "@storybook/react";
import { fakeSearchRequests } from "@common/fakeData";
import { SearchRequestTable } from "../components/searchRequest/SearchRequestTable";

// It is possible data may come back from api with missing data.

const stories = storiesOf("Search Results", module);

stories.add("Search Result Table", () => (
  <SearchRequestTable
    poolCandidateSearchRequests={fakeSearchRequests()}
    editUrlRoot="#"
  />
));
