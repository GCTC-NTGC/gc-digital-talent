import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeSkills, fakeSkillFamilies } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  UpdateSkillFamilyForm,
  UpdateSkillFamilySkill_Fragment,
  UpdateSkillFamily_Fragment,
} from "./UpdateSkillFamilyPage";

const mockSkills = fakeSkills();
const mockSkillFamilies = fakeSkillFamilies();

const skillFragments = mockSkills.map((skill) =>
  makeFragmentData(skill, UpdateSkillFamilySkill_Fragment),
);

const skillFamilyFragment = makeFragmentData(
  mockSkillFamilies[0],
  UpdateSkillFamily_Fragment,
);

export default {
  component: UpdateSkillFamilyForm,
  title: "Forms/Update Skill Family Form",
} as Meta<typeof UpdateSkillFamilyForm>;

const Template: StoryFn<typeof UpdateSkillFamilyForm> = (args) => {
  const { skillFamilyQuery, skillsQuery } = args;

  return (
    <UpdateSkillFamilyForm
      skillFamilyQuery={skillFamilyQuery}
      skillsQuery={skillsQuery}
      handleUpdateSkillFamily={async (id, data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            action("Update SkillFamily")({
              id,
              data,
            });
            resolve(mockSkillFamilies[0]);
          }, 1000);
        });
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  skillFamilyQuery: skillFamilyFragment,
  skillsQuery: skillFragments,
};
