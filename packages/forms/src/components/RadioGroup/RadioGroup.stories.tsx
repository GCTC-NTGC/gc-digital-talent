import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import { VIEWPORT, allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import RadioGroup from "./RadioGroup";

faker.seed(0);

export default {
  component: RadioGroup,
  title: "Form/Radio Group",
};

const Template: StoryFn<typeof RadioGroup> = (args) => (
  <Form onSubmit={action("Submit Form")}>
    <RadioGroup {...args} />
    <p data-h2-margin-top="base(x1)">
      <Submit />
    </p>
  </Form>
);

export const Default = Template.bind({});
Default.args = {
  idPrefix: "radiogroup",
  legend: "Which item do you want to check?",
  name: "radiogroup",
  items: [
    { value: "one", label: "Box One" },
    { value: "two", label: "Box Two" },
    { value: "three", label: "Box Three" },
  ],
};
Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
  },
};

export const WithContext = Template.bind({});
WithContext.args = {
  ...Default.args,
  context:
    "Check the action tab after submitting to see how the form values are represented.",
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const Elements = Template.bind({});
Elements.args = {
  idPrefix: "elements",
  legend: "Look at these elements",
  name: "elements",
  items: [
    {
      value: "one",
      label: (
        <span data-h2-background-color="base(error.lighter)">
          Red Selection
        </span>
      ),
    },
    {
      value: "two",
      label: (
        <span data-h2-background-color="base(white)">White Selection</span>
      ),
    },
    {
      value: "three",
      label: <span data-h2-font-weight="base(700)">Bold Selection</span>,
    },
  ],
};

export const Large = Template.bind({});
Large.parameters = {
  viewport: {
    defaultViewport: VIEWPORT.PHONE,
  },
};
Large.args = {
  idPrefix: "radiogroup",
  legend: "Which item do you want to check?",
  name: "radiogroup",
  items: [
    { value: "one", label: "This is the first item" },
    { value: "two", label: "This is the second item" },
    { value: "three", label: "This is the third item" },
    { value: "four", label: "This is the fourth item" },
    { value: "five", label: "This is the fifth item" },
    { value: "six", label: "This is the sixth item" },
    { value: "seven", label: "This is the seventh item" },
  ],
  columns: 2,
};

export const LongLegend = Template.bind({});
LongLegend.args = {
  ...Default.args,
  legend:
    "This is a super, super long title which will wrap around to a second line at some point. Fusce lacinia sollicitudin nulla, sit amet semper metus mattis id. Suspendisse nisl enim, bibendum sed sem eget, porttitor ultrices metus.",
};

export const ContentBelow = Template.bind({});
ContentBelow.args = {
  ...Default.args,
  items: Default.args.items?.map((item) => ({
    ...item,
    contentBelow: faker.lorem.lines(6),
  })),
};
