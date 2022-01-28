import React from "react";
import { storiesOf } from "@storybook/react";
import { fakeSkillFamiliesWithSkills } from "@common/fakeData";
import { SkillFamilyTable } from "../components/skillFamily/SkillFamilyTable";

const { skillFamilies } = fakeSkillFamiliesWithSkills();

const stories = storiesOf("Skill Families", module);

stories.add("Skill Families Table", () => (
  <SkillFamilyTable skillFamilies={skillFamilies} editUrlRoot="#" />
));
