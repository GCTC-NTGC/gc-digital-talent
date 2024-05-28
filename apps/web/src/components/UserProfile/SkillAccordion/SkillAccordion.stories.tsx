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

export const AccordionAward = TemplateSkillAccordion.bind({});
export const AccordionCommunity = TemplateSkillAccordion.bind({});
export const AccordionEducation = TemplateSkillAccordion.bind({});
export const AccordionPersonal = TemplateSkillAccordion.bind({});
export const AccordionWork = TemplateSkillAccordion.bind({});
export const AccordionNoExperience = TemplateSkillAccordion.bind({});

AccordionAward.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerators.awardExperiences(),
  },
};

AccordionCommunity.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerators.communityExperiences(2),
  },
};

AccordionEducation.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerators.educationExperiences(),
  },
};

AccordionPersonal.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerators.personalExperiences(),
  },
};

AccordionWork.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: experienceGenerators.workExperiences(),
  },
};
AccordionNoExperience.args = {
  skill: {
    ...fakeSkills()[0],
    experiences: [],
  },
};
