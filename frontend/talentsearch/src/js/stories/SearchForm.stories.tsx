import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeClassifications, fakePools, fakeUsers } from "@common/fakeData";
import pick from "lodash/pick";
import { Classification } from "../api/generated";
import {
  SearchContainer,
  SearchContainerProps,
} from "../components/search/SearchContainer";

export default {
  component: SearchContainer,
  title: "Search Form",
  args: {
    classifications: fakeClassifications() as Classification[],
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

const Template: Story<SearchContainerProps> = (args) => {
  return <SearchContainer {...args} />;
};

export const Default = Template.bind({});
