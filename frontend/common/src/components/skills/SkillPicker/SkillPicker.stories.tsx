import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import type { Skill } from "../../../api/generated";
import { fakeSkills, fakeSkillFamilies } from "../../../fakeData";
import SkillPicker from "./SkillPicker";

type ComponentType = typeof SkillPicker;
type Story = ComponentStory<ComponentType>;
type Meta = ComponentMeta<ComponentType>;

const mockFamilies = fakeSkillFamilies(10);
const mockSkills = fakeSkills(30, mockFamilies);

export default {
  component: SkillPicker,
  title: "Components/Skill Picker",
  args: {
    skills: mockSkills,
  },
} as Meta;

const Template: Story = (args) => {
  const { skills } = args;
  const [addedSkills, setAddedSkills] = React.useState<Skill[]>([]);

  const handleChange = (newSkills: Skill[]) => {
    setAddedSkills(newSkills);
  };

  return (
    <SkillPicker
      skills={skills}
      selectedSkills={addedSkills}
      onChange={handleChange}
    />
  );
};

export const BasicSkillPicker = Template.bind({});
