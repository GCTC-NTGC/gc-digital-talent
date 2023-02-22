import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import pick from "lodash/pick";
import {
  fakeClassifications,
  fakePools,
  fakeUsers,
} from "@gc-digital-talent/fake-data";

import { Classification } from "~/api/generated";
import {
  SearchContainerProps,
  SearchContainerComponent,
} from "./SearchContainer";

export default {
  component: SearchContainerComponent,
  title: "Forms/Search Form",
  args: {
    classifications: fakeClassifications() as Classification[],
    pool: pick(fakePools()[0], ["name", "description"]),
    poolOwner: pick(fakeUsers()[0], ["firstName", "lastName"]),
    candidateCount: 10,
    updatePending: { control: false },
    candidateFilter: action("updateCandidateFilter"),
    updateCandidateFilter: action("updateCandidateFilter"),
    updateInitialValues: action("updateInitialValues"),
    onUpdateApplicantFilter: action("updateApplicantFilter"),
    handleSubmit: action("handleSubmit"),
  },
} as Meta;

const Template: Story<SearchContainerProps> = (args) => {
  return <SearchContainerComponent {...args} />;
};

export const Default = Template.bind({});
