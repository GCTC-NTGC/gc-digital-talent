import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeOperationalRequirements,
  fakePools,
  fakeUsers,
} from "@common/fakeData";
import pick from "lodash/pick";
import { SearchForm, SearchFormProps } from "../components/search/SearchForm";
import {
  Classification,
  CmoAsset,
  OperationalRequirement,
} from "../api/generated";
import {
  SearchContainer,
  SearchContainerProps,
} from "../components/search/SearchContainer";

export default {
  component: SearchContainer,
  title: "Search Form",
  args: {
    classifications: fakeClassifications() as Classification[],
    cmoAssets: fakeCmoAssets() as CmoAsset[],
    operationalRequirements:
      fakeOperationalRequirements() as OperationalRequirement[],
    pool: pick(fakePools()[0], ["name", "description"]),
    poolOwner: pick(fakeUsers()[0], ["firstName", "lastName"]),
    candidateCount: 10,
    updatePending: { control: false },
    candidateFilter: action("updateCandidateFilter"),
    updateCandidateFilter: action("updateCandidateFilter"),
    updateInitialValues: action("updateInitialValues"),
    handleSubmit: action("handleSubmit"),
  },
} as Meta;

const TemplateSearchForm: Story<SearchContainerProps> = (args) => {
  return <SearchContainer {...args} />;
};

export const Form = TemplateSearchForm.bind({});
