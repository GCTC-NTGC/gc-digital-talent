import { StoryFn, Meta } from "@storybook/react-vite";
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
  tags: ["needs-fix"],
} as Meta<typeof Chip>;

const Template: StoryFn<typeof Chip> = (args) => {
  return (
    <Chips>
      <Chip key="primary" color="primary" {...args}>
        Primary
      </Chip>
      <Chip key="secondary" color="secondary" {...args}>
        Secondary
      </Chip>
      <Chip key="success" color="success" {...args}>
        Success
      </Chip>
      <Chip key="warning" color="warning" {...args}>
        Warning
      </Chip>
      <Chip key="error" color="error" {...args}>
        Error
      </Chip>
      <Chip key="black" color="black" {...args}>
        Black
      </Chip>
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
