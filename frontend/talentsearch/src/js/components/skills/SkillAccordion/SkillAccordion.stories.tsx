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
        experienceGenerator.awardExperiences()[1],
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
        experienceGenerator.communityExperiences()[1],
      ),
      generator.generateExperienceSkill(
        skill,
        experienceGenerator.communityExperiences()[1],
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
        experienceGenerator.educationExperiences()[1],
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
        experienceGenerator.personalExperiences()[1],
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
        experienceGenerator.workExperiences()[1],
      ),
    ],
  },
};
AccordionNoExperienceExample.args = {
  skill: {
    ...fakeSkills()[0],
    experienceSkills: [],
  },
};
