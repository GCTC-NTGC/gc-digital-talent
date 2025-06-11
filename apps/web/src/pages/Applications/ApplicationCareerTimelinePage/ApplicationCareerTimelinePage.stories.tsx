import { Meta, StoryFn } from "@storybook/react-vite";

import {
  fakeExperiences,
  fakePoolCandidates,
} from "@gc-digital-talent/fake-data";
import { Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType } from "@gc-digital-talent/graphql";

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
  experiences: fakeExperiences(5),
};

export default {
  component: ApplicationCareerTimeline,
} as Meta<typeof ApplicationCareerTimeline>;

export const NoExperiences = {
  args: noExperiencesProps,
};

export const HasExperiences = {
  args: hasExperiencesProps,
};
