import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeClassifications,
  fakeCmoAssets,
  fakeOperationalRequirements,
} from "@common/fakeData";
import SearchForm, { SearchFormProps } from "../components/search/SearchForm";
import {
  Classification,
  CmoAsset,
  LanguageAbility,
  OperationalRequirement,
  WorkRegion,
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

// const stories = storiesOf("Search Form", module);
const TemplateSearchForm: Story<SearchFormProps> = (args) => {
  return <SearchForm {...args} />;
};

export const Form = TemplateSearchForm.bind({});
export const FormWithInitialData = TemplateSearchForm.bind({});

FormWithInitialData.args = {
  initialPoolCandidateFilter: {
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
  },
};
