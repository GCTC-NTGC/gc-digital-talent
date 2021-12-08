import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeOperationalRequirements,
} from "@common/fakeData";
import { SearchForm, SearchFormProps } from "../components/search/SearchForm";
import {
  Classification,
  CmoAsset,
  OperationalRequirement,
} from "../api/generated";

export default {
  component: SearchForm,
  title: "Search Form",
  args: {
    classifications: fakeClassifications() as Classification[],
    cmoAssets: fakeCmoAssets() as CmoAsset[],
    operationalRequirements:
      fakeOperationalRequirements() as OperationalRequirement[],
    updateCandidateFilter: action("updateCandidateFilter"),
  },
} as Meta;

const TemplateSearchForm: Story<SearchFormProps> = (args) => {
  return <SearchForm {...args} />;
};

export const Form = TemplateSearchForm.bind({});
