import { StoryFn, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AcademicCapIcon from "@heroicons/react/20/solid/AcademicCapIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

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
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/guHeIIh8dqFVCks310Wv0G/Component-library?node-id=11-4252",
    },
  },
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

export const Default = Template.bind({});
Default.args = {
  onDismiss: undefined,
};

export const Dismissible = Template.bind({});
Dismissible.args = {
  onDismiss: () => action("dismiss")({}),
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: AcademicCapIcon,
  onDismiss: () => action("dismiss")({}),
};
