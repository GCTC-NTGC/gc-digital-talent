import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MissingSkills from "./MissingSkills";

import { fakeSkills } from "../../../fakeData";

type MissingSkillsComponent = typeof MissingSkills;

const skills = fakeSkills();

const fakeRequiredSkills = skills.splice(0, skills.length / 2);
const fakeOptionalSkills = skills.splice(skills.length / 2, skills.length);

export default {
  title: "Skills/Missing Skills",
  component: MissingSkills,
} as ComponentMeta<MissingSkillsComponent>;

const Template: ComponentStory<MissingSkillsComponent> = (args) => {
  const { optionalSkills, requiredSkills, addedSkills } = args;
  return (
    <MissingSkills
      optionalSkills={optionalSkills}
      requiredSkills={requiredSkills}
      addedSkills={addedSkills}
    />
  );
};

export const MissingBothSkills = Template.bind({});
MissingBothSkills.args = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: fakeOptionalSkills,
  addedSkills: [],
};

export const MissingRequiredSkills = Template.bind({});
MissingRequiredSkills.args = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: fakeOptionalSkills,
  addedSkills: fakeOptionalSkills,
};

export const MissingOptionalSkills = Template.bind({});
MissingOptionalSkills.args = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: fakeOptionalSkills,
  addedSkills: fakeRequiredSkills,
};

export const MissingSomeSkills = Template.bind({});
MissingSomeSkills.args = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: fakeOptionalSkills,
  addedSkills: [
    ...fakeRequiredSkills.splice(0, skills.length / 2),
    ...fakeOptionalSkills.splice(0, skills.length / 2),
  ],
};
