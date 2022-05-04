import React from "react";
import { storiesOf } from "@storybook/react";
import { fakePoolCandidates, fakeSearchRequests } from "@common/fakeData";
import { action } from "@storybook/addon-actions";
import { SearchRequestTable } from "../components/searchRequest/SearchRequestTable";
import { PoolCandidateSearchRequest } from "../api/generated";
import { SingleSearchRequestTable } from "../components/searchRequest/SingleSearchRequestTable";
import { UpdateSearchRequestForm } from "../components/searchRequest/UpdateSearchRequest";
import { SingleSearchRequest } from "../components/searchRequest/SingleSearchRequest";

const stories = storiesOf("Search Requests", module);

stories.add("Search Request Table", () => (
  <SearchRequestTable
    poolCandidateSearchRequests={fakeSearchRequests()}
    editUrlRoot="#"
  />
));

stories.add("Single Search Request Table", () => (
  <SingleSearchRequestTable searchPoolCandidates={fakePoolCandidates()} />
));

stories.add("Update Single Search Request", () => (
  <UpdateSearchRequestForm
    initialSearchRequest={fakeSearchRequests()[0] as PoolCandidateSearchRequest}
    handleUpdateSearchRequest={async (id, data) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      action("Update Search Result")(data);
      return data;
    }}
  />
));

stories.add("Single Search Requests Page", () => (
  <SingleSearchRequest
    searchRequest={fakeSearchRequests()[0] as PoolCandidateSearchRequest}
  />
));
