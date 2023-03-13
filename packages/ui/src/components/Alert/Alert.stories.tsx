import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import Alert from "./Alert";
import { AlertType } from "./types";

const types: Array<AlertType> = ["info", "success", "warning", "error"];

faker.seed(0);

export default {
  component: Alert.Root,
  title: "Components/Alert",
  args: {
    children: faker.lorem.sentences(3),
    icon: BellIcon,
  },
} as ComponentMeta<typeof Alert.Root>;

const TemplateAlert: ComponentStory<typeof Alert.Root> = ({
  children,
  ...args
}) => {
  return (
    <div
      data-h2-padding="base(x2)"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
    >
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
