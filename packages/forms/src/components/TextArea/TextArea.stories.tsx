import { action } from "@storybook/addon-actions";
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
      <p className="mt-6">
        <Submit />
      </p>
    </Form>
  );
};

export const Default = TemplateTextArea.bind({});
Default.args = {
  context: "Additional context about this field.",
  rules: {
    required: "This field is required",
  },
};
Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      dark: allModes.dark,
    },
  },
};

export const WordLimit = TemplateTextArea.bind({});
WordLimit.args = {
  wordLimit: 10,
};
