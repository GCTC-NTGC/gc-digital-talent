import { useState } from "react";
import { StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { faker } from "@faker-js/faker/locale/en";

import { Heading } from "@gc-digital-talent/ui";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import RichTextInput from "./RichTextInput";
import RichTextRenderer from "./RichTextRenderer";
import { htmlToRichTextJSON } from "../../utils";

const defaultContent = `
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
  args: {
    name: "richText",
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
  const [output, setOutput] = useState<string>(
    defaultValue ? String(defaultValue) : "",
  );
  return (
    <>
      <Form
        options={{
          mode: "onSubmit",
          defaultValues: defaultValue
            ? {
                [rest.name]: defaultValue,
              }
            : undefined,
        }}
        onSubmit={(data) => {
          action("Submit Form")(data);
          setOutput(String(data.richText));
        }}
      >
        <RichTextInput {...rest} />
        <p className="my-6">
          <Submit />
        </p>
      </Form>
      <Heading size="h6">Preview</Heading>
      <div className="*:first-child:mt-0 rounded-sm bg-white p-6 shadow-lg dark:bg-gray-600">
        <RichTextRenderer node={htmlToRichTextJSON(output)} />
      </div>
    </>
  );
};

faker.seed(0);

export const Default = {
  render: Template,
};

export const DefaultValue = {
  render: Template,

  args: {
    defaultValue: defaultContent,
  },

  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
};

export const Required = {
  render: Template,

  args: {
    rules: {
      required: "This field is required!",
    },
  },
};

export const ReadOnly = {
  render: Template,

  args: {
    defaultValue: defaultContent,
    readOnly: true,
  },
};

export const WordLimit = {
  render: Template,

  args: {
    defaultValue: defaultContent,
    wordLimit: 5,
  },
};

export const WithContext = {
  render: Template,

  args: {
    context: "Only lists and links are available.",
  },
};

export const LongContent = {
  render: Template,

  args: {
    defaultValue: `
    <p>${faker.lorem.paragraph(15)}</p>
    <p>${faker.lorem.paragraph(14)}</p>
    <p>${faker.lorem.paragraph(13)}</p>
    <p>${faker.lorem.paragraph(12)}</p>
    <p>${faker.lorem.paragraph(11)}</p>
    `,
  },
};

export const WithHeading = {
  render: Template,

  args: {
    defaultValue: `<h3>A heading 3</h3>${defaultContent}`,
    allowHeadings: true,
  },
};
