import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeOperationalRequirements,
} from "@common/fakeData";
import SearchForm from "../components/search/SearchForm";
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
  const poolCandidateFilter: PoolCandidateFilter = {
    id: "1",
    operationalRequirements: [
      fakeOperationalRequirements()[0],
      fakeOperationalRequirements()[1],
    ],
    cmoAssets: [fakeCmoAssets()[0], fakeCmoAssets()[1]],
    classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    hasDiploma: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    isWoman: true,
    languageAbility: LanguageAbility.Bilingual,
    workRegions: [WorkRegion.BritishColumbia, WorkRegion.Ontario],
    pools: null,
  };

  return (
    <SearchForm
      totalEstimatedCandidates={10}
      classifications={fakeClassifications() as Classification[]}
      cmoAssets={fakeCmoAssets() as CmoAsset[]}
      initialPoolCandidateFilter={poolCandidateFilter}
      operationalRequirements={
        fakeOperationalRequirements() as OperationalRequirement[]
      }
      handleUpdateFilter={action("updateFilter")}
    />
  );
});

stories.add("Empty Search Form", () => {
  return (
    <SearchForm
      classifications={fakeClassifications() as Classification[]}
      cmoAssets={fakeCmoAssets() as CmoAsset[]}
      operationalRequirements={
        fakeOperationalRequirements() as OperationalRequirement[]
      }
      handleUpdateFilter={action("updateFilter")}
    />
  );
});
