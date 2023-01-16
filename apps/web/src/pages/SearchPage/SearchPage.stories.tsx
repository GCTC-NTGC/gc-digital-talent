import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeClassifications, fakePools } from "@common/fakeData";

import { Classification, Pool } from "~/api/generated";
import {
  SearchContainerComponent,
  SearchContainerProps as SearchPageProps,
} from "./SearchContainer";

export default {
  component: SearchContainerComponent,
  title: "Pages/Search Page",
  args: {
    classifications: fakeClassifications() as Classification[],
    pool: fakePools()[0] as Pool,
    poolOwner: fakePools()[0].owner,
    candidateCount: 10,
    updatePending: false,
    updateCandidateFilter: action("updateCandidateFilter"),
    updateInitialValues: action("updateInitialValues"),
    handleSubmit: action("handleSubmit"),
  },
} as Meta;

const TemplateSearchPage: Story<SearchPageProps> = (args) => {
  return <SearchContainerComponent {...args} />;
};

export const SearchPage = TemplateSearchPage.bind({});
export const UpdatingSearchPage = TemplateSearchPage.bind({});

UpdatingSearchPage.args = {
  ...SearchPage.args,
  updatePending: true,
};
