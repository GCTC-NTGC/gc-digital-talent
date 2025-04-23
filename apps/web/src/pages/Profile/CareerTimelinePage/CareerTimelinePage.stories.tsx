import { StoryFn, Meta } from "@storybook/react";

import { fakeExperiences } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import CareerTimeline, {
  CareerTimelineExperience_Fragment,
} from "./components/CareerTimeline";

export default {
  component: CareerTimeline,
  args: {
    userId: "test",
    experiencesQuery: [],
    applicationsQuery: [],
  },
} as Meta<typeof CareerTimeline>;

const CareerTimelineTemplate: StoryFn<typeof CareerTimeline> = (args) => {
  return <CareerTimeline {...args} />;
};

export const NoExperiences = CareerTimelineTemplate.bind({});
export const WithExperiences = CareerTimelineTemplate.bind({});
export const NoExperiencesMissingSkills = CareerTimelineTemplate.bind({});
export const WithExperiencesMissingSkills = CareerTimelineTemplate.bind({});

const mockExperiences = fakeExperiences(10);

NoExperiences.args = {
  experiencesQuery: [],
};

WithExperiences.args = {
  experiencesQuery: mockExperiences.map((experience) =>
    makeFragmentData(experience, CareerTimelineExperience_Fragment),
  ),
};
