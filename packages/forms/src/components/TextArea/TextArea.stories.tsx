import React from "react";
import { action } from "@storybook/addon-actions";
import { StoryFn } from "@storybook/react";

import Form from "../BasicForm";
import Submit from "../Submit";

import TextArea from ".";
import type { TextAreaProps } from ".";

export default {
  component: TextArea,
  title: "Form/TextArea",
  args: {
    id: "description",
    name: "description",
    label: "Description",
  },
};

const themes = ["light", "dark"];

const TemplateTextArea: StoryFn<TextAreaProps & { maxWidth: string }> = (
  args,
) => {
  const { ...rest } = args;
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) l-tablet(50% 50%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
            <Form onSubmit={action("Submit Form")}>
              <TextArea {...rest} />
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

export const Default = TemplateTextArea.bind({});
Default.args = {
  context: "Additional context about this field.",
  rules: {
    required: "This field is required",
  },
};

export const CustomLabel = TemplateTextArea.bind({});
CustomLabel.args = {
  label: <span className="font-bold">Bolded question</span>,
};

export const WordLimit = TemplateTextArea.bind({});
WordLimit.args = {
  wordLimit: 10,
};
