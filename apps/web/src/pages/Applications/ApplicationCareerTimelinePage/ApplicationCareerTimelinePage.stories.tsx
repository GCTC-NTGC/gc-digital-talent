import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
  fakeExperiences,
  fakePoolCandidates,
} from "@gc-digital-talent/fake-data";

import { ExperienceForDate } from "~/types/experience";

import { ApplicationCareerTimeline } from "./ApplicationCareerTimelinePage";

const fakePoolCandidate = fakePoolCandidates(1)[0];
const fakeUser = fakePoolCandidate.user;

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
  experiences: fakeExperiences(5) as Array<ExperienceForDate>,
};

export default {
  component: ApplicationCareerTimeline,
  title: "Pages/Application/Review Career Timeline",
} as Meta<typeof ApplicationCareerTimeline>;

const Template: ApplicationCareerTimelineStory = (props) => (
  <ApplicationCareerTimeline {...props} />
);

export const NoExperiences = Template.bind({});
NoExperiences.args = noExperiencesProps;

export const HasExperiences = Template.bind({});
HasExperiences.args = hasExperiencesProps;
