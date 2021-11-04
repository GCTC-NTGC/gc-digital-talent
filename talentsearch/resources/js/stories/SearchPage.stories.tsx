import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeOperationalRequirements,
  fakePools,
} from "@common/fakeData";
import {
  SearchPage as SearchPageComponent,
  SearchPageProps,
} from "../components/search/SearchPage";
import {
  Classification,
  CmoAsset,
  OperationalRequirement,
  Pool,
} from "../api/generated";

export default {
  component: SearchPageComponent,
  title: "Search Page",
  args: {
    classifications: fakeClassifications() as Classification[],
    cmoAssets: fakeCmoAssets() as CmoAsset[],
    operationalRequirements:
      fakeOperationalRequirements() as OperationalRequirement[],

    pool: fakePools()[0] as Pool,
    candidateCount: 10,
    updatePending: false,
    updateCandidateFilter: action("updateCandidateFilter"),
  },
} as Meta;

const TemplateSearchPage: Story<SearchPageProps> = (args) => {
  return <SearchPageComponent {...args} />;
};

export const SearchPage = TemplateSearchPage.bind({});
export const UpdatingSearchPage = TemplateSearchPage.bind({});

UpdatingSearchPage.args = {
  ...SearchPage.args,
  updatePending: true,
};
