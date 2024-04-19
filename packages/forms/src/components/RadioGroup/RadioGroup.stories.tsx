import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import { VIEWPORT } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import RadioGroup from "./RadioGroup";

faker.seed(0);

export default {
  component: RadioGroup,
  title: "Form/RadioGroup",
};

const themes = ["light", "dark"];

const TemplateRadioGroup: StoryFn<typeof RadioGroup> = (args) => {
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) l-tablet(50% 50%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
            <Form onSubmit={action("Submit Form")}>
              <RadioGroup {...args} />
              <p data-h2-margin-top="base(x1)">
                <Submit />
              </p>
            </Form>
          </div>
        </div>
      ))}
    </div>
  );
};

export const BasicRadioGroup = TemplateRadioGroup.bind({});
BasicRadioGroup.args = {
  idPrefix: "radiogroup",
  legend: "Which item do you want to check?",
  name: "radiogroup",
  items: [
    { value: "one", label: "Box One" },
    { value: "two", label: "Box Two" },
    { value: "three", label: "Box Three" },
  ],
};

export const RequiredRadioGroup = TemplateRadioGroup.bind({});
RequiredRadioGroup.args = {
  ...BasicRadioGroup.args,
  rules: { required: "At least one item must be checked!" },
};

export const RadioGroupWithContext = TemplateRadioGroup.bind({});
RadioGroupWithContext.args = {
  ...BasicRadioGroup.args,
  context:
    "Check the action tab after submitting to see how the form values are represented.",
};

export const DisabledRadioGroup = TemplateRadioGroup.bind({});
DisabledRadioGroup.args = {
  ...BasicRadioGroup.args,
  disabled: true,
};

export const RadioGroupOfElements = TemplateRadioGroup.bind({});
RadioGroupOfElements.args = {
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
      label: <span className="font-bold">Bold Selection</span>,
    },
  ],
};

export const LargeRadioGroup = TemplateRadioGroup.bind({});
LargeRadioGroup.parameters = {
  viewport: {
    defaultViewport: VIEWPORT.PHONE,
  },
};
LargeRadioGroup.args = {
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

export const LongLegendRadioGroup = TemplateRadioGroup.bind({});
LongLegendRadioGroup.args = {
  ...BasicRadioGroup.args,
  legend:
    "This is a super, super long title which will wrap around to a second line at some point. Fusce lacinia sollicitudin nulla, sit amet semper metus mattis id. Suspendisse nisl enim, bibendum sed sem eget, porttitor ultrices metus.",
};

export const ContentBelowRadioGroup = TemplateRadioGroup.bind({});
ContentBelowRadioGroup.args = {
  ...BasicRadioGroup.args,
  items: BasicRadioGroup.args.items?.map((item) => ({
    ...item,
    contentBelow: faker.lorem.lines(6),
  })),
};
