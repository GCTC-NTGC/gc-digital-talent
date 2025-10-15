import { Meta, StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  getStaticSkills,
  fakeClassifications,
  fakePools,
  fakeLocalizedEnum,
  fakeWorkStreams,
} from "@gc-digital-talent/fake-data";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  FlexibleWorkLocation,
  LanguageAbility,
  WorkRegion,
} from "@gc-digital-talent/graphql";

import { SearchForm } from "./SearchForm";

faker.seed(0);

const mockPools = fakePools(10);
const poolResponse = fakePools(3);
const mockClassifications = fakeClassifications();
const mockWorkStreams = fakeWorkStreams();
const skills = getStaticSkills();

export default {
  component: SearchForm,
  decorators: [MockGraphqlDecorator],
  args: {
    pools: mockPools,
    classifications: mockClassifications,
    workStreams: mockWorkStreams,
    skills,
  },
} as Meta<typeof SearchForm>;

const SearchRequestOptions = {
  data: {
    languageAbilities: fakeLocalizedEnum(LanguageAbility),
    workRegions: fakeLocalizedEnum(WorkRegion),
    flexibleWorkLocations: fakeLocalizedEnum(FlexibleWorkLocation),
  },
};

const Template: StoryFn<typeof SearchForm> = (args) => <SearchForm {...args} />;

export const Default = Template.bind({});
Default.parameters = {
  apiResponses: {
    SearchRequestOptions,
  },
};

export const WithResults = Template.bind({});
WithResults.parameters = {
  apiResponsesConfig: {
    latency: {
      min: 0,
      max: 0,
    },
  },
  apiResponses: {
    CountApplicants: {
      data: {
        countApplicantsForSearch: faker.number.int({ max: 50 }),
        countPoolCandidatesByPool: poolResponse.map((pool) => ({
          pool,
          candidateCount: faker.number.int({ max: 10 }),
        })),
      },
    },
    SearchRequestOptions,
  },
};
