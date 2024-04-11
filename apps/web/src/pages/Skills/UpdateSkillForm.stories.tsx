import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeSkills, fakeSkillFamilies } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  UpdateSkillForm,
  UpdateSkillSkillFamily_Fragment,
  UpdateSkill_Fragment,
} from "./UpdateSkillPage";

const mockSkills = fakeSkills();
const mockSkillFamilies = fakeSkillFamilies();

const skillFragment = makeFragmentData(mockSkills[0], UpdateSkill_Fragment);
const skillFamiliesFragment = mockSkillFamilies.map((skillFamily) =>
  makeFragmentData(skillFamily, UpdateSkillSkillFamily_Fragment),
);

export default {
  component: UpdateSkillForm,
  title: "Forms/Update Skill Form",
} as Meta<typeof UpdateSkillForm>;

const Template: StoryFn<typeof UpdateSkillForm> = (args) => {
  const { skillQuery, familiesQuery } = args;

  return (
    <UpdateSkillForm
      familiesQuery={familiesQuery}
      skillQuery={skillQuery}
      handleUpdateSkill={async (id, data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            action("Update Skill")({
              id,
              data,
            });
            resolve(data);
          }, 1000);
        });
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  skillQuery: skillFragment,
  familiesQuery: skillFamiliesFragment,
};
