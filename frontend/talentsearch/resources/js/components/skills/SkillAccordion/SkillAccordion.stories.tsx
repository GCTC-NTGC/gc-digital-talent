import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeSkills, fakeSkillFamilies } from "@common/fakeData";
import fakeExperiences, { generators } from "@common/fakeData/fakeExperiences";
import { useIntl } from "react-intl";
import SkillAccordion, { SkillAccordionProps } from "./SkillAccordion";

const skill = fakeSkills(1);
const experiences = [generators.generatePersonal()];
export default {
  component: SkillAccordion,
  title: "Skill Accordion",
  args: {
    skill: skill[0],
  },
} as Meta;

const TemplateSkillAccordion: Story<SkillAccordionProps> = (args) => {
  return <SkillAccordion {...args} />;
};

export const SkillAccordionStory = TemplateSkillAccordion.bind({});
