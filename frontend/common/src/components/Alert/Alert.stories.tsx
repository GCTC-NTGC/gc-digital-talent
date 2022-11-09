import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Alert, { AlertProps, AlertType } from "./Alert";
import Separator from "../Separator";

const types: Array<AlertType> = ["info", "success", "warning", "error"];

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

const TemplateAlert: Story<AlertProps> = ({ children, ...args }) => {
  return (
    <div data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
      {types.map((type) => (
        <React.Fragment key={type}>
          <Alert
            {...args}
            type={type}
            title={type.charAt(0).toUpperCase() + type.slice(1)}
          >
            {children}
            {type === "error" && (
              <Alert.Footer>
                <p>
                  <a href="/#">Reach out to our support team</a> if you have any
                  questions.
                </p>
              </Alert.Footer>
            )}
          </Alert>
        </React.Fragment>
      ))}
    </div>
  );
};

export const Default = TemplateAlert.bind({});

export const Dismissible = TemplateAlert.bind({});
Dismissible.args = {
  dismissible: true,
  onDismiss: () => {
    action("onDismiss")();
  },
};
