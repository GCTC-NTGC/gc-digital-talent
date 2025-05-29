import { action } from "storybook/actions";
import { StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import TextArea, { type TextAreaProps } from "./TextArea";

export default {
  component: TextArea,
  args: {
    id: "description",
    name: "description",
    label: "Description",
  },
};

const TemplateTextArea: StoryFn<TextAreaProps> = (args) => {
  return (
    <Form onSubmit={action("Submit Form")}>
      <TextArea {...args} />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </Form>
  );
};

export const Default = {
  render: TemplateTextArea,

  args: {
    context: "Additional context about this field.",
    rules: {
      required: "This field is required",
    },
  },

  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
};

export const WordLimit = {
  render: TemplateTextArea,

  args: {
    wordLimit: 10,
  },
};
