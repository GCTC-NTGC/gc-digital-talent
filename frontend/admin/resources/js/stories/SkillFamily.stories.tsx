/* eslint-disable no-promise-executor-return */
import React from "react";
import { storiesOf } from "@storybook/react/";
import { action } from "@storybook/addon-actions";
import { fakeSkills, fakeSkillFamilies } from "@common/fakeData";
import {
  SkillFamily,
  SkillCategory,
  CreateSkillFamilyInput,
  UpdateSkillFamilyInput,
} from "../api/generated";
import { SkillFamilyTable } from "../components/skillFamily/SkillFamilyTable";
import { CreateSkillFamilyForm } from "../components/skillFamily/CreateSkillFamily";
import { UpdateSkillFamilyForm } from "../components/skillFamily/UpdateSkillFamily";

const skills = fakeSkills();
const skillFamilies = fakeSkillFamilies(15, skills);

const stories = storiesOf("Skill Families", module);

stories.add("Skill Families Table", () => (
  <SkillFamilyTable skillFamilies={skillFamilies} editUrlRoot="#" />
));

stories.add("Create Skill Family Form", () => (
  <CreateSkillFamilyForm
    skills={skills}
    handleCreateSkillFamily={async (data: CreateSkillFamilyInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      action("Create Skill Family")(data);
      return null;
    }}
  />
));

stories.add("Update Skill Family Form", () => {
  const skillFamily: SkillFamily = {
    id: "1",
    key: "skill_family_key",
    name: {
      en: "Skill Family Name",
      fr: "Skill Family Name FR",
    },
    description: {
      en: "Skill Family Description",
      fr: "Skill Family Description FR",
    },
    category: SkillCategory.Technical,
    skills: [skills[0], skills[1]],
  };

  return (
    <UpdateSkillFamilyForm
      initialSkillFamily={skillFamily}
      skills={skills}
      handleUpdateSkillFamily={async (
        id: string,
        data: UpdateSkillFamilyInput,
      ) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Skill Family")(data);
        return null;
      }}
    />
  );
});
