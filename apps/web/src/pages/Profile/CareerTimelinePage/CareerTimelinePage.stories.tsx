import { StoryFn, Meta } from "@storybook/react-vite";

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

const mockExperiences = fakeExperiences(10);

export const NoExperiences = {
  render: CareerTimelineTemplate,

  args: {
    experiencesQuery: [],
  },
};

export const WithExperiences = {
  render: CareerTimelineTemplate,

  args: {
    experiencesQuery: mockExperiences.map((experience) =>
      makeFragmentData(experience, CareerTimelineExperience_Fragment),
    ),
  },
};

export const NoExperiencesMissingSkills = {
  render: CareerTimelineTemplate,
};

export const WithExperiencesMissingSkills = {
  render: CareerTimelineTemplate,
};
