import React from "react";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import Link from "../Link";
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
    <div>
      <div data-h2="light">
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr 1fr)"
        >
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
            {types.map((type) => (
              <React.Fragment key={type}>
                <Alert.Root {...args} type={type}>
                  <Alert.Title>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Alert.Title>
                  <p>{children}</p>
                  {type === "error" && (
                    <Alert.Footer>
                      <p data-h2-font-size="base(caption)">
                        <Link external href="/#">
                          Reach out to our support team
                        </Link>{" "}
                        if you have any questions.
                      </p>
                    </Alert.Footer>
                  )}
                </Alert.Root>
              </React.Fragment>
            ))}
          </div>
          <div data-h2="dark">
            <div
              data-h2-background="base(background)"
              data-h2-padding="base(x2)"
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
                        <p data-h2-font-size="base(caption)">
                          <Link external href="/#">
                            Reach out to our support team
                          </Link>{" "}
                          if you have any questions.
                        </p>
                      </Alert.Footer>
                    )}
                  </Alert.Root>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
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
