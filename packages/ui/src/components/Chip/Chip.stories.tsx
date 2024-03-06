import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AcademicCapIcon from "@heroicons/react/20/solid/AcademicCapIcon";

import { Color } from "../../types";
import Chip from "./Chip";
import Chips from "./Chips";

const colors: Color[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
  "error",
  "warning",
  "success",
  "black",
];

export default {
  component: Chip,
  title: "Components/Chip",
} as Meta<typeof Chip>;

const Template: StoryFn<typeof Chip> = (args) => {
  return (
    <Chips>
      {colors.map((color) => (
        <Chip key={color} color={color} {...args}>
          {color}
        </Chip>
      ))}
    </Chips>
  );
};

export const NoDismiss = Template.bind({});

export const Dismissible = Template.bind({});
Dismissible.args = {
  onDismiss: () => action("dismiss")({}),
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: AcademicCapIcon,
};
