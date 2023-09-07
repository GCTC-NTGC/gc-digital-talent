import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Form from "../BasicForm";
import Submit from "../Submit";
import RichTextInput from "./RichTextInput";

const defaultValue = `
<p>Paragraph</p>
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
  <li>List item 3</li>
</ul>
<p><a href="#">Link</a></p>
`;

export default {
  component: RichTextInput,
  title: "Form/Rich Text",
  args: {
    name: "rich-text",
    id: "rich-text",
    label: "Rich Text",
  },
};

type RichTextInputArgs = typeof RichTextInput;
type DefaultValueRichTextInputArgs = RichTextInputArgs & {
  defaultValue?: string;
};

const Template: StoryFn<DefaultValueRichTextInputArgs> = (args) => {
  const { defaultValue, ...rest } = args;
  return (
    <Form
      options={{
        mode: "onSubmit",
        defaultValues: defaultValue
          ? {
              [rest.name]: defaultValue,
            }
          : undefined,
      }}
      onSubmit={(data) => action("Submit Form")(data)}
    >
      <RichTextInput {...rest} />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </Form>
  );
};

export const Default = Template.bind({});

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValue,
};

export const Required = Template.bind({});
Required.args = {
  rules: {
    required: "This field is required!",
  },
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  defaultValue,
  readOnly: true,
};

export const WordLimit = Template.bind({});
WordLimit.args = {
  defaultValue,
  wordLimit: 5,
};

export const WithContext = Template.bind({});
WithContext.args = {
  context: "Only lists are available.",
};
