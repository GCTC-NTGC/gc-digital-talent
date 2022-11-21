import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import type { Skill } from "../../api/generated";
import { fakeSkills, fakeSkillFamilies } from "../../fakeData";
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
  const skipToRef = React.useRef<HTMLHeadingElement>(null);
  const [addedSkills, setAddedSkills] = React.useState<Skill[]>([]);

  const handleChange = (newSkills: Skill[]) => {
    setAddedSkills(newSkills);
  };

  return (
    <>
      <SkillPicker
        skills={skills}
        selectedSkills={addedSkills}
        onUpdateSelectedSkills={handleChange}
        skipToRef={skipToRef}
      />
      <h2
        ref={skipToRef}
        id="skip-target"
        tabIndex={-1}
        data-h2-margin="base(x1, 0, x.5, 0)"
      >
        Skip Target
      </h2>
      <p data-h2-margin="base(x.25, 0)">
        Use the skip to link or press <kbd>ctrl</kbd> + <kbd>shift</kbd> +{" "}
        <kbd>esc</kbd> to jump here.
      </p>
    </>
  );
};

export const Default = Template.bind({});
