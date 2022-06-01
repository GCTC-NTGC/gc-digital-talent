import React from "react";
import { Meta, Story } from "@storybook/react";
import { fakeSkills } from "../../../fakeData";
import { generators as experienceGenerator } from "../../../fakeData/fakeExperiences";
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
    experiences: experienceGenerator.awardExperiences(),
  },
};

AccordionCommunityExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerator.communityExperiences(2),
  },
};

AccordionEducationExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerator.educationExperiences(),
  },
};

AccordionPersonalExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerator.personalExperiences(),
  },
};

AccordionWorkExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerator.workExperiences(),
  },
};
AccordionNoExperienceExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: [],
  },
};
