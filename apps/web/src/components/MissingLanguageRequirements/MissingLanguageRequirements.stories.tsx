import type { StoryFn, Meta } from "@storybook/react-vite";

import {
  fakePools,
  fakeUsers,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { PoolLanguage } from "@gc-digital-talent/graphql";

import MissingLanguageRequirements from "./MissingLanguageRequirements";

type MissingLanguageRequirementsComponent = typeof MissingLanguageRequirements;

const unilingualUser = {
  ...fakeUsers(1)[0],
  lookingForEnglish: true,
  lookingForFrench: false,
  lookingForBilingual: false,
};
const bilingualPool = {
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

export const Default = Template.bind({});
Default.args = {
  user: unilingualUser,
  pool: bilingualPool,
};
