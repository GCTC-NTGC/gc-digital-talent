import { Meta, StoryFn } from "@storybook/react";

import {
  fakeExperiences,
  fakePoolCandidates,
} from "@gc-digital-talent/fake-data";
import { Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType } from "@gc-digital-talent/graphql";

import { ExperienceForDate } from "~/types/experience";

import { ApplicationCareerTimeline } from "./ApplicationCareerTimelinePage";

const fakePoolCandidate = fakePoolCandidates(
  1,
)[0] as ApplicationPoolCandidateFragmentType;
const fakeUser = fakePoolCandidate.user;
fakePoolCandidate.submittedAt = null;

type ApplicationCareerTimelineStory = StoryFn<typeof ApplicationCareerTimeline>;

const noExperiencesProps: ApplicationCareerTimelineStory["args"] = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: [],
    },
  },
  experiences: [],
};

const hasExperiencesProps: ApplicationCareerTimelineStory["args"] = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: fakeExperiences(5),
    },
  },
  experiences: fakeExperiences(5) as ExperienceForDate[],
};

export default {
  component: ApplicationCareerTimeline,
} as Meta<typeof ApplicationCareerTimeline>;

const Template: ApplicationCareerTimelineStory = (props) => (
  <ApplicationCareerTimeline {...props} />
);

export const NoExperiences = Template.bind({});
NoExperiences.args = noExperiencesProps;

export const HasExperiences = Template.bind({});
HasExperiences.args = hasExperiencesProps;
