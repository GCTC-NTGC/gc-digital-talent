import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { Accordion } from "@gc-digital-talent/ui";
import { fakeSkills, experienceGenerators } from "@gc-digital-talent/fake-data";

import SkillAccordion, { SkillAccordionProps } from "./SkillAccordion";

const skill = fakeSkills()[0];
export default {
  component: SkillAccordion,
  title: "Components/Skill Accordion",
  args: {
    skill,
  },
} as Meta;

const TemplateSkillAccordion: StoryFn<SkillAccordionProps> = (args) => {
  const {
    skill: { id },
  } = args;
  return (
    <Accordion.Root type="single" defaultValue={id}>
      <SkillAccordion {...args} />
    </Accordion.Root>
  );
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
    experiences: experienceGenerators.awardExperiences(),
  },
};

AccordionCommunityExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerators.communityExperiences(2),
  },
};

AccordionEducationExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerators.educationExperiences(),
  },
};

AccordionPersonalExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerators.personalExperiences(),
  },
};

AccordionWorkExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerators.workExperiences(),
  },
};
AccordionNoExperienceExample.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: [],
  },
};
