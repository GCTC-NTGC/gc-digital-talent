import { StoryFn, Meta } from "@storybook/react";
import { action } from "storybook/actions";
import AcademicCapIcon from "@heroicons/react/20/solid/AcademicCapIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Chip from "./Chip";
import Chips from "./Chips";

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
      <Chip color="primary" {...args}>
        Primary
      </Chip>
      <Chip color="secondary" {...args}>
        Secondary
      </Chip>
      <Chip color="success" {...args}>
        Success
      </Chip>
      <Chip color="warning" {...args}>
        Warning
      </Chip>
      <Chip color="error" {...args}>
        Error
      </Chip>
      <Chip color="black" {...args}>
        Black
      </Chip>
    </Chips>
  );
};

export const Default = {
  render: Template,

  args: {
    onDismiss: undefined,
  },
};

export const Dismissible = {
  render: Template,

  args: {
    onDismiss: () => action("dismiss")({}),
  },
};

export const WithIcon = {
  render: Template,

  args: {
    icon: AcademicCapIcon,
    onDismiss: () => action("dismiss")({}),
  },
};
