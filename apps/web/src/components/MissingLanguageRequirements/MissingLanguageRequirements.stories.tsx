import { StoryFn, Meta } from "@storybook/react-vite";

import {
  fakePools,
  fakeUsers,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { User, Pool, PoolLanguage } from "@gc-digital-talent/graphql";

import MissingLanguageRequirements from "./MissingLanguageRequirements";

type MissingLanguageRequirementsComponent = typeof MissingLanguageRequirements;

const unilingualUser: User = {
  ...(fakeUsers(1)[0] as User),
  lookingForEnglish: true,
  lookingForFrench: false,
  lookingForBilingual: false,
};
const bilingualPool: Pool = {
  ...fakePools(1)[0],
  language: toLocalizedEnum(PoolLanguage.BilingualAdvanced),
};

export default {
  component: MissingLanguageRequirements,
} as Meta<MissingLanguageRequirementsComponent>;

const Template: StoryFn<MissingLanguageRequirementsComponent> = (args) => {
  const { user, pool } = args;
  return <MissingLanguageRequirements user={user} pool={pool} />;
};

export const Default = {
  render: Template,

  args: {
    user: unilingualUser,
    pool: bilingualPool,
  },
};
