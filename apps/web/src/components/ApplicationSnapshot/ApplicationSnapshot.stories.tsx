import type { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  fakePoolCandidates,
  fakeUsers,
  fakePools,
  fakeLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import type { GeneralQuestionResponse, User } from "@gc-digital-talent/graphql";
import {
  FlexibleWorkLocation,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import ApplicationSnapshot, {
  ApplicationSnapshot_Fragment,
} from "./ApplicationSnapshot";

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
let mockUser: User = fakeUsers(1)[0];
mockUser = {
  ...mockUser,
  experiences: mockPoolCandidate.educationRequirementExperiences,
  poolCandidates: [mockPoolCandidate],
};

mockPoolCandidate = {
  __typename: "PoolCandidate",
  ...mockPoolCandidate,
  pool: mockPool,
  user: mockUser,
  profileSnapshot: JSON.stringify(mockUser),
  generalQuestionResponses,
};

export default {
  component: ApplicationSnapshot,
  decorators: [MockGraphqlDecorator],
  args: {
    query: makeFragmentData(mockPoolCandidate, ApplicationSnapshot_Fragment),
    defaultOpen: true,
  },
  parameters: {
    apiResponses: {
      WorkPreferencesSnapshotOptions: {
        data: {
          justifications: fakeLocalizedEnum(FlexibleWorkLocation),
        },
      },
    },
  },
} satisfies Meta<typeof ApplicationSnapshot>;

export const Default: StoryObj<typeof ApplicationSnapshot> = {};
