import React from "react";
import { storiesOf } from "@storybook/react";
import { fakeSkillFamilies } from "@common/fakeData";
import { SkillFamilyTable } from "../components/skillFamily/SkillFamilyTable";

const skillFamilyData = fakeSkillFamilies();

const stories = storiesOf("Skill Families", module);

stories.add("Skill Families Table", () => (
  <SkillFamilyTable skillFamilies={skillFamilyData} editUrlRoot="#" />
));
