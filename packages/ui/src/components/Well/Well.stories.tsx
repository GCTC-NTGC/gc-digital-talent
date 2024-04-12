import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import Well from "./Well";

faker.seed(0);

export default {
  component: Well,
  title: "Components/Well",
  args: {
    content: faker.lorem.sentences(2),
  },
} as Meta;

const themes = ["light", "dark"];

const Template: StoryFn = (args) => {
  const { content } = args;
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) l-tablet(50% 50%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div
            data-h2-background="base(background)"
            data-h2-padding="base(x2)"
            data-h2-margin-top="base:children[>div:not(:first-child)](x.25)"
          >
            <Well>
              <p>Default: {content}</p>
            </Well>
            <Well color="success">
              <p>Success: {content}</p>
            </Well>
            <Well color="warning">
              <p>Warning: {content}</p>
            </Well>
            <Well color="error">
              <p>Error: {content}</p>
            </Well>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Default = Template.bind({});
