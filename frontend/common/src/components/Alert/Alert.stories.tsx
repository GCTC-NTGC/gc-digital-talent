import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Meta, Story } from "@storybook/react";
import Alert, { AlertProps, Color } from "./Alert";

const types: Array<Color> = ["success", "warning"];

export default {
  component: Alert,
  title: "Components/Alert",
  args: {
    title: "Alert",
    children:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum eligendi dolore vel optio! Amet non adipisci blanditiis accusantium? Laborum nobis facilis vel dolore numquam libero velit aspernatur, ut consectetur neque.",
    icon: BellIcon,
  },
} as Meta;

const TemplateAlert: Story<AlertProps> = (args) => {
  return (
    <div data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
      {types.map((type) => (
        <Alert
          key={type}
          {...args}
          type={type}
          title={type.charAt(0).toUpperCase() + type.slice(1)}
        />
      ))}
    </div>
  );
};

export const Default = TemplateAlert.bind({});
