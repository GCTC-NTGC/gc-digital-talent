import React from "react";
import { Meta, Story } from "@storybook/react";
import { fakeSkills } from "@common/fakeData";
import generator from "@common/fakeData/fakeExperienceSkills";
import { generators as experienceGenerator } from "@common/fakeData/fakeExperiences";

import SkillAccordion, { SkillAccordionProps } from "./SkillAccordion";

const skill = fakeSkills()[0];
export default {
  component: SkillAccordion,
  title: "Skill Accordion",
  args: {
    skill,
  },
} as Meta;

const TemplateSkillAccordion: Story<SkillAccordionProps> = (args) => {
  return <SkillAccordion {...args} />;
};

export const AccordionAwardExample = TemplateSkillAccordion.bind({});
export const AccordionCommunityExample = TemplateSkillAccordion.bind({});
export const AccordionEducationExample = TemplateSkillAccordion.bind({});
export const AccordionPersonalExample = TemplateSkillAccordion.bind({});
export const AccordionWorkExample = TemplateSkillAccordion.bind({});
export const AccordionNoExperienceExample = TemplateSkillAccordion.bind({});

AccordionAwardExample.args = {
  skill: {
    ...fakeSkills()[0],
    experienceSkills: [
      generator.generateExperienceSkill(
        skill,
        experienceGenerator.generateAward(),
      ),
    ],
  },
};

AccordionCommunityExample.args = {
  skill: {
    ...fakeSkills()[0],
    experienceSkills: [
      generator.generateExperienceSkill(
        skill,
        experienceGenerator.generateCommunity(),
      ),
      generator.generateExperienceSkill(
        skill,
        experienceGenerator.generateCommunity(),
      ),
    ],
  },
};

AccordionEducationExample.args = {
  skill: {
    ...fakeSkills()[0],
    experienceSkills: [
      generator.generateExperienceSkill(
        skill,
        experienceGenerator.generateEducation(),
      ),
    ],
  },
};

AccordionPersonalExample.args = {
  skill: {
    ...fakeSkills()[0],
    experienceSkills: [
      generator.generateExperienceSkill(
        skill,
        experienceGenerator.generatePersonal(),
      ),
    ],
  },
};

AccordionWorkExample.args = {
  skill: {
    ...fakeSkills()[0],
    experienceSkills: [
      generator.generateExperienceSkill(
        skill,
        experienceGenerator.generateWork(),
      ),
    ],
  },
};

AccordionWorkExample.args = {
  skill: {
    ...fakeSkills()[0],
    experienceSkills: [],
  },
};
