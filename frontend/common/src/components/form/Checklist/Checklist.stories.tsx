import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Checklist, { ChecklistProps } from ".";
import Form from "../BasicForm";
import Submit from "../Submit";

export default {
  component: Checklist,
  title: "Form/Checklist",
} as Meta;

const TemplateChecklist: Story<ChecklistProps> = (args) => {
  return (
    <Form onSubmit={action("Submit Form")}>
      <Checklist {...args} />
      <Submit />
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

export const ChecklistHiddenOptional = TemplateChecklist.bind({});
ChecklistHiddenOptional.args = {
  ...BasicChecklist.args,
  hideOptional: true,
};

export const ChecklistOfLabelElements = TemplateChecklist.bind({});
ChecklistOfLabelElements.args = {
  idPrefix: "elements",
  legend: "Look at these elements",
  name: "elements",
  items: [
    {
      value: "one",
      label: <span data-h2-bg-color="b(red)">Red Selection</span>,
    },
    {
      value: "two",
      label: <span data-h2-bg-color="b(white)">White Selection</span>,
    },
    {
      value: "three",
      label: <span data-h2-font-weight="b(700)">Bold Selection</span>,
    },
  ],
};
