import { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  fakePoolCandidates,
  fakeUsers,
  fakePools,
} from "@gc-digital-talent/fake-data";
import {
  GeneralQuestionResponse,
  makeFragmentData,
  User,
} from "@gc-digital-talent/graphql";

import ApplicationInformation, {
  ApplicationInformation_PoolCandidateFragment,
  ApplicationInformation_PoolFragment,
} from "./ApplicationInformation";

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
  ...mockPoolCandidate,
  pool: mockPool,
  generalQuestionResponses,
};

let mockUser: User = fakeUsers(1)[0];
mockUser = {
  ...mockUser,
  experiences: mockPoolCandidate.educationRequirementExperiences,
  poolCandidates: [mockPoolCandidate],
};

export default {
  component: ApplicationInformation,
  args: {
    poolQuery: makeFragmentData(mockPool, ApplicationInformation_PoolFragment),
    applicationQuery: makeFragmentData(
      mockPoolCandidate,
      ApplicationInformation_PoolCandidateFragment,
    ),
    snapshot: mockUser,
    defaultOpen: true,
  },
} satisfies Meta<typeof ApplicationInformation>;

export const Default: StoryObj<typeof ApplicationInformation> = {};
