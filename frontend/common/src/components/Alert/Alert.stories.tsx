import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Meta, Story } from "@storybook/react";
import Alert, { AlertProps } from "./Alert";

export default {
  component: Alert,
  title: "Components/Alert",
  args: {
    title: "Alert",
    message:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum eligendi dolore vel optio! Amet non adipisci blanditiis accusantium? Laborum nobis facilis vel dolore numquam libero velit aspernatur, ut consectetur neque.",
    icon: <BellIcon style={{ width: "1.4rem" }} />,
  },
} as Meta;

const TemplateAlert: Story<AlertProps> = (args) => {
  return <Alert {...args} />;
};

export const Success = TemplateAlert.bind({});

Success.args = {
  type: "success",
};
