import React from "react";
import { storiesOf } from "@storybook/react";
import { fakeSkillFamiliesWithSkills } from "@common/fakeData";
import { SkillTable } from "../components/skill/SkillTable";

const { skills } = fakeSkillFamiliesWithSkills();

const stories = storiesOf("Skills", module);

stories.add("Skills Table", () => (
  <SkillTable skills={skills} editUrlRoot="#" />
));
