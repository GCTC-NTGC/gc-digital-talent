import React from "react";
import { storiesOf } from "@storybook/react";
import { fakeSearchRequests } from "@common/fakeData";
import { SearchRequestTable } from "../components/searchRequest/SearchRequestTable";


const stories = storiesOf("Search Results", module);

stories.add("Search Results Table", () => (
  <SearchRequestTable
    poolCandidateSearchRequests={fakeSearchRequests()}
    editUrlRoot="#"
  />
));
