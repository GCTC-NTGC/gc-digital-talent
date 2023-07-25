import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Checklist from "./Checklist";
import Form from "../BasicForm";
import Submit from "../Submit";

export default {
  component: Checklist,
  title: "Form/Checklist",
};

const TemplateChecklist: StoryFn<typeof Checklist> = (args) => {
  return (
    <Form onSubmit={action("Submit Form")}>
      <Checklist {...args} />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </Form>
  );
};

export const BasicChecklist = TemplateChecklist.bind({});
BasicChecklist.args = {
  idPrefix: "checklist",
  legend: "Which items do you want to check?",
  name: "checklist",
  items: [
    { value: "one", label: "Box One" },
    { value: "two", label: "Box Two" },
    { value: "three", label: "Box Three" },
  ],
};

export const RequiredChecklist = TemplateChecklist.bind({});
RequiredChecklist.args = {
  ...BasicChecklist.args,
  rules: { required: "All items must be checked!" },
};

export const ChecklistWithContext = TemplateChecklist.bind({});
ChecklistWithContext.args = {
  ...BasicChecklist.args,
  context:
    "Check the action tab after submitting to see how the form values are represented.",
};

export const DisabledChecklist = TemplateChecklist.bind({});
DisabledChecklist.args = {
  ...BasicChecklist.args,
  disabled: true,
};

export const ChecklistOfLabelElements = TemplateChecklist.bind({});
ChecklistOfLabelElements.args = {
  idPrefix: "elements",
  legend: "Look at these elements",
  name: "elements",
  items: [
    {
      value: "one",
      label: (
        <span
          data-h2-background-color="base(error)"
          data-h2-color="base(white)"
        >
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
