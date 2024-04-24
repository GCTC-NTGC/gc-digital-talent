import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { fakeExperiences } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import CareerTimelineAndRecruitment, {
  CareerTimelineExperience_Fragment,
} from "./components/CareerTimelineAndRecruitment";

export default {
  title: "Pages/Profile And Applications/Career Timeline And Recruitment Page",
  args: {
    userId: "test",
    experiencesQuery: [],
    applicationsQuery: [],
  },
} as Meta<typeof CareerTimelineAndRecruitment>;

const CareerTimelineAndRecruitmentTemplate: StoryFn<
  typeof CareerTimelineAndRecruitment
> = (args) => {
  return <CareerTimelineAndRecruitment {...args} />;
};

export const NoExperiences = CareerTimelineAndRecruitmentTemplate.bind({});
export const WithExperiences = CareerTimelineAndRecruitmentTemplate.bind({});
export const NoExperiencesMissingSkills =
  CareerTimelineAndRecruitmentTemplate.bind({});
export const WithExperiencesMissingSkills =
  CareerTimelineAndRecruitmentTemplate.bind({});

const mockExperiences = fakeExperiences(10);

NoExperiences.args = {
  experiencesQuery: [],
};

WithExperiences.args = {
  experiencesQuery: mockExperiences.map((experience) =>
    makeFragmentData(experience, CareerTimelineExperience_Fragment),
  ),
};
