import { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import {
  fakePoolCandidates,
  fakeUsers,
  fakePools,
} from "@gc-digital-talent/fake-data";
import { GeneralQuestionResponse, User } from "@gc-digital-talent/graphql";

import ApplicationInformation from "./ApplicationInformation";

faker.seed(0);

const question = faker.lorem.words(6);
const generalQuestionResponses: GeneralQuestionResponse[] = [
  {
    id: faker.string.uuid(),
    answer: faker.lorem.sentences(3),
    generalQuestion: {
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
  generalQuestionResponses,
};

let mockUser: User = fakeUsers(1)[0];
mockUser = {
  ...mockUser,
  poolCandidates: [mockPoolCandidate],
};

export default {
  component: ApplicationInformation,
  args: {
    poolQuery: mockPool,
    application: mockPoolCandidate,
    snapshot: mockUser,
    user: mockUser,
    defaultOpen: true,
  },
};

const Template: StoryFn<typeof ApplicationInformation> = (args) => (
  <ApplicationInformation {...args} />
);

export const Default = Template.bind({});
