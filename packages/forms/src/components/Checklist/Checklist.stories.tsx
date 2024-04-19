import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Form from "../BasicForm";
import Submit from "../Submit";
import Checklist from "./Checklist";

export default {
  component: Checklist,
  title: "Form/Checklist",
};

const themes = ["light", "dark"];

const TemplateChecklist: StoryFn<typeof Checklist> = (args) => {
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) l-tablet(50% 50%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
            <Form onSubmit={action("Submit Form")}>
              <Checklist {...args} />
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

export const LongLegendChecklist = TemplateChecklist.bind({});
LongLegendChecklist.args = {
  ...BasicChecklist.args,
  legend:
    "This is a super, super long title which will wrap around to a second line at some point. Fusce lacinia sollicitudin nulla, sit amet semper metus mattis id. Suspendisse nisl enim, bibendum sed sem eget, porttitor ultrices metus.",
};
