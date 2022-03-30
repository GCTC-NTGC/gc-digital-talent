import React from "react";
import { Meta, Story } from "@storybook/react";
import { fakeSkills } from "@common/fakeData";
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
    experiences: [experienceGenerator.generateAward()],
  },
};

AccordionCommunityExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: [
      experienceGenerator.generateCommunity(),
      experienceGenerator.generateCommunity(),
    ],
  },
};

AccordionEducationExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: [experienceGenerator.generateEducation()],
  },
};

AccordionPersonalExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: [experienceGenerator.generatePersonal()],
  },
};

AccordionWorkExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: [experienceGenerator.generateWork()],
  },
};
AccordionNoExperienceExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: [],
  },
};
