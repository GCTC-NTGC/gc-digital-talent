import { useState } from "react";
import { StoryFn } from "@storybook/react";
import { action } from "storybook/actions";

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
        <p data-h2-margin="base(x1, 0)">
          <Submit />
        </p>
      </Form>
      <Heading
        size="h6"
        data-h2-color="base(black)"
        data-h2-font-weight="base(700)"
      >
        Preview
      </Heading>
      <div
        data-h2-radius="base(s)"
        data-h2-padding="base(x1)"
        data-h2-shadow="base(larger)"
        data-h2-background-color="base(foreground)"
        data-h2-margin-top="base:children[>*:first-child](0)"
      >
        <RichTextRenderer node={htmlToRichTextJSON(output)} />
      </div>
    </>
  );
};

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
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vitae nibh a ex malesuada dictum ut sed ligula. Integer in ligula lacinia arcu vehicula convallis vel vel mauris. Praesent vitae augue bibendum, condimentum tortor non, consectetur nisl. Morbi consectetur dolor a elit tincidunt congue. Phasellus pellentesque elit vitae erat commodo aliquam. Fusce id quam nunc. Donec et sapien eu turpis pellentesque lacinia. Vivamus fringilla, tortor vitae venenatis cursus, ipsum libero ultrices neque, sit amet aliquam diam mauris et urna. Quisque nec finibus sem. Ut porttitor nunc blandit turpis porttitor, bibendum tincidunt leo aliquam. Vivamus lobortis odio quis tristique tincidunt.</p>
    <p>Integer vitae vehicula velit, ut euismod nulla. Ut a odio a lacus egestas scelerisque. Vivamus erat enim, tempus nec volutpat nec, tincidunt in augue. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ut magna leo. Morbi maximus, neque a aliquet feugiat, mauris odio rhoncus est, eu pharetra lorem velit in risus. Aliquam aliquet ultrices dignissim. Etiam ante felis, sodales quis dapibus et, volutpat non nibh. Sed magna risus, blandit ut semper lobortis, rutrum sed dolor.</p>
    <p>Sed ut finibus tellus. Vestibulum a ante nec neque scelerisque pulvinar. Vestibulum auctor urna vitae tortor cursus laoreet ut et odio. Duis mattis at ligula in congue. Maecenas vel urna nec leo tincidunt sodales in non lorem. Mauris pharetra volutpat massa, ut accumsan velit tincidunt vel. Morbi vehicula congue suscipit. Ut hendrerit lacus ac nunc blandit, ac lacinia odio vulputate. Aenean et luctus augue, a eleifend odio. Integer efficitur convallis enim, at dignissim urna varius in. Nullam odio massa, sollicitudin vel tempor vitae, iaculis non nulla. Vestibulum vehicula dolor mauris, ac viverra elit accumsan et. Quisque sed placerat sapien. Praesent id enim ut tellus porta dignissim. Sed mattis elementum tortor a mattis.</p>
    <p>Aenean id suscipit sapien. Praesent at mollis risus. Phasellus imperdiet, ante ac egestas viverra, turpis dolor porta augue, at pellentesque enim odio eget libero. Integer volutpat accumsan interdum. Curabitur fermentum dapibus dolor. Ut malesuada ante sit amet odio sagittis, eget convallis odio posuere. Sed vitae turpis nec diam maximus varius.</p>
    <p>Etiam sagittis urna lobortis, volutpat augue eu, molestie lacus. Praesent finibus lorem ut quam imperdiet fringilla. Duis accumsan facilisis erat, id blandit mi rhoncus eu. Sed tempor, justo eu pharetra molestie, sem justo laoreet urna, nec sagittis libero ipsum blandit lacus. Proin at libero et turpis dictum convallis. Aliquam ut pharetra dolor, pellentesque consequat sem. Phasellus dictum quam purus, fermentum ornare augue iaculis vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum pellentesque leo ac diam rutrum congue. Pellentesque at rutrum nibh.</p>
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
