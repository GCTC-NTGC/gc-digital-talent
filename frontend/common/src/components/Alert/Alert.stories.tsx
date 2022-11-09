import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Alert, { AlertType } from "./Alert";

const types: Array<AlertType> = ["info", "success", "warning", "error"];

export default {
  component: Alert.Root,
  title: "Components/Alert",
  args: {
    children:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum eligendi dolore vel optio! Amet non adipisci blanditiis accusantium? Laborum nobis facilis vel dolore numquam libero velit aspernatur, ut consectetur neque.",
    icon: BellIcon,
  },
} as ComponentMeta<typeof Alert.Root>;

const TemplateAlert: ComponentStory<typeof Alert.Root> = ({
  children,
  ...args
}) => {
  return (
    <div data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
      {types.map((type) => (
        <React.Fragment key={type}>
          <Alert.Root {...args} type={type}>
            <Alert.Title>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Alert.Title>
            <p>{children}</p>
            {type === "error" && (
              <Alert.Footer>
                <p>
                  <a href="/#">Reach out to our support team</a> if you have any
                  questions.
                </p>
              </Alert.Footer>
            )}
          </Alert.Root>
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
