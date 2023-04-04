import React from "react";
import { Meta, ComponentStory } from "@storybook/react";
import { fakeExperiences, fakeSkills } from "@gc-digital-talent/fake-data";
import { Experience } from "~/api/generated";
import ExperienceTreeView from "./ExperienceTreeView";

const skills = fakeSkills(2);
const skillWithoutExperiences = skills[0];

const experiences = fakeExperiences(5) as Experience[];
const skillWithExperiences = skills[1];
skillWithExperiences.experiences?.push(...experiences);

export default {
  component: ExperienceTreeView,
  title: "Components/TreeView/ExperienceTreeView",
  args: {
    skill: skillWithoutExperiences,
  },
} as Meta;

const InitialModeView: ComponentStory<typeof ExperienceTreeView> = (args) => {
  return <ExperienceTreeView {...args} />;
};

const DisplayModeView: ComponentStory<typeof ExperienceTreeView> = (args) => {
  return <ExperienceTreeView {...args} />;
};

export const InitialMode = InitialModeView.bind({});
export const DisplayMode = DisplayModeView.bind({});
DisplayMode.args = {
  skill: skillWithExperiences,
};
