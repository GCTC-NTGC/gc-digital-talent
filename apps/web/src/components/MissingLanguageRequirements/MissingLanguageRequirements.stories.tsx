import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { fakePools, fakeUsers } from "@gc-digital-talent/fake-data";
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
  language: PoolLanguage.BilingualAdvanced,
};

export default {
  title: "Components/Missing Language Requirements",
  component: MissingLanguageRequirements,
} as ComponentMeta<MissingLanguageRequirementsComponent>;

const Template: ComponentStory<MissingLanguageRequirementsComponent> = (
  args,
) => {
  const { user, pool } = args;
  return <MissingLanguageRequirements user={user} pool={pool} />;
};

export const MissingRequiredLanguageRequirement = Template.bind({});
MissingRequiredLanguageRequirement.args = {
  user: unilingualUser,
  pool: bilingualPool,
};
