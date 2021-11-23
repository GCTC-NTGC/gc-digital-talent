import React from "react";
import { storiesOf } from "@storybook/react";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeOperationalRequirements,
} from "@common/fakeData";
import {SearchForm} from "../components/search/SearchForm";
import {
  Classification,
  CmoAsset,
  LanguageAbility,
  OperationalRequirement,
  PoolCandidateFilter,
  WorkRegion,
} from "../api/generated";

const stories = storiesOf("Search Form", module);

stories.add("Search Form", () => {
  return (
    <SearchForm
      totalEstimatedCandidates={10}
      classifications={fakeClassifications() as Classification[]}
      cmoAssets={fakeCmoAssets() as CmoAsset[]}
      operationalRequirements={
        fakeOperationalRequirements() as OperationalRequirement[]
      }
    />
  );
});
