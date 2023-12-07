import React from "react";
import { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import {
  fakePoolCandidates,
  fakeUsers,
  fakePools,
} from "@gc-digital-talent/fake-data";
import { ScreeningQuestionResponse, User } from "@gc-digital-talent/graphql";

import ApplicationInformation from "./ApplicationInformation";

faker.seed(0);

const question = faker.lorem.words(6);
const screeningQuestionResponses: ScreeningQuestionResponse[] = [
  {
    id: faker.string.uuid(),
    answer: faker.lorem.sentences(3),
    screeningQuestion: {
      id: faker.string.uuid(),
      question: {
        en: `${question}? (EN)`,
        fr: `${question}? (FR)`,
      },
    },
  },
];

const mockPool = fakePools(1)[0];
let mockPoolCandidate = fakePoolCandidates(1)[0];
mockPoolCandidate = {
  __typename: "PoolCandidate",
  educationRequirementExperiences: [],
  ...mockPoolCandidate,
  pool: mockPool,
  screeningQuestionResponses,
};

let mockUser: User = fakeUsers(1)[0];
mockUser = {
  ...mockUser,
  poolCandidates: [mockPoolCandidate],
};

export default {
  component: ApplicationInformation,
  title: "Components/Application Info",
  args: {
    snapshot: mockUser,
    application: mockPoolCandidate,
  },
};

const Template: StoryFn<typeof ApplicationInformation> = (args) => (
  <ApplicationInformation {...args} />
);

export const Default = Template.bind({});
