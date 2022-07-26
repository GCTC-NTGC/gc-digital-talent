/* eslint-disable no-promise-executor-return */
import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeSkills, fakeSkillFamilies } from "@common/fakeData";
import { Skill, CreateSkillInput, UpdateSkillInput } from "../api/generated";
import { SkillTable } from "../components/skill/SkillTable";
import { CreateSkillForm } from "../components/skill/CreateSkill";
import { UpdateSkillForm } from "../components/skill/UpdateSkill";

const skillFamilies = fakeSkillFamilies();
const skills = fakeSkills(10, skillFamilies);

const stories = storiesOf("Skills", module);

stories.add("Skills Table", () => (
  <SkillTable skills={skills} editUrlRoot="#" />
));

stories.add("Create Skill Form", () => (
  <CreateSkillForm
    families={skillFamilies}
    handleCreateSkill={async (data: CreateSkillInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      action("Create Skill")(data);
      return null;
    }}
  />
));

stories.add("Update Skill Form", () => {
  const skill: Skill = {
    id: "1",
    key: "skill_key",
    name: {
      en: "Skill Name",
      fr: "Skill Name FR",
    },
    description: {
      en: "Skill Description",
      fr: "Skill Description FR",
    },
    keywords: {
      en: ["one EN", "one two EN", "other words EN"],
      fr: ["one FR", "one two FR", "other words FR"],
    },
    families: [skillFamilies[0], skillFamilies[1]],
  };

  return (
    <UpdateSkillForm
      initialSkill={skill}
      families={skillFamilies}
      handleUpdateSkill={async (id: string, data: UpdateSkillInput) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Update Skill")(data);
        return null;
      }}
    />
  );
});
