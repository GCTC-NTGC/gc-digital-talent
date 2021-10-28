import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeOperationalRequirements,
  fakePools,
} from "@common/fakeData";
import HomePage from "../components/HomePage";
import SearchPage from "../components/search/SearchPage";
import {
  Classification,
  CmoAsset,
  OperationalRequirement,
  Pool,
} from "../api/generated";

const stories = storiesOf("Pages", module);

stories.add("Home Page", () => {
  return <HomePage />;
});

stories.add("Search Page", () => {
  return (
    <SearchPage
      classifications={fakeClassifications() as Classification[]}
      cmoAssets={fakeCmoAssets() as CmoAsset[]}
      operationalRequirements={
        fakeOperationalRequirements() as OperationalRequirement[]
      }
      pool={fakePools()[0] as Pool}
      candidateCount={10}
      candidateFilter={undefined}
      updateCandidateFilter={action("updateCandidateFilter")}
    />
  );
});
