import { Meta, StoryFn } from "@storybook/react";

import { Accordion } from "@gc-digital-talent/ui";
import { fakeSkills, experienceGenerators } from "@gc-digital-talent/fake-data";

import SkillAccordion, { SkillAccordionProps } from "./SkillAccordion";

const skill = fakeSkills()[0];
export default {
  component: SkillAccordion,
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

export const AccordionAward = {
  render: TemplateSkillAccordion,

  args: {
    skill: {
      ...fakeSkills()[0],
      experiences: experienceGenerators.awardExperiences(),
    },
  },
};

export const AccordionCommunity = {
  render: TemplateSkillAccordion,

  args: {
    skill: {
      ...fakeSkills()[0],
      experiences: experienceGenerators.communityExperiences(2),
    },
  },
};

export const AccordionEducation = {
  render: TemplateSkillAccordion,

  args: {
    skill: {
      ...fakeSkills()[0],
      experiences: experienceGenerators.educationExperiences(),
    },
  },
};

export const AccordionPersonal = {
  render: TemplateSkillAccordion,

  args: {
    skill: {
      ...fakeSkills()[0],
      experiences: experienceGenerators.personalExperiences(),
    },
  },
};

export const AccordionWork = {
  render: TemplateSkillAccordion,

  args: {
    skill: {
      ...fakeSkills()[0],
      experiences: experienceGenerators.workExperiences(),
    },
  },
};

export const AccordionNoExperience = {
  render: TemplateSkillAccordion,

  args: {
    skill: {
      ...fakeSkills()[0],
      experiences: [],
    },
  },
};
