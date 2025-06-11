import { StoryFn, Meta } from "@storybook/react-vite";
import { action } from "@storybook/addon-actions";

import { VIEWPORT, allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import Checkbox, { type CheckboxProps } from "./Checkbox";

export default {
  component: Checkbox,
} as Meta;

const Template: StoryFn<CheckboxProps> = (args) => (
  <Form onSubmit={action("Submit Form")}>
    <Checkbox {...args} />
    <Submit data-h2-margin-top="base(x1)" />
  </Form>
);

export const Default = Template.bind({});
export const WithBoundingBox = Template.bind({});
export const WithElementLabel = Template.bind({});
export const WithLongText = Template.bind({});

Default.args = {
  id: "hasDiploma",
  name: "hasDiploma",
  label: "Have a Diploma",
  context: "This will help prove you satisfy education requirements.",
  rules: { required: "This must be accepted to continue." },
};

Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      dark: allModes.dark,
    },
  },
};

WithBoundingBox.args = {
  ...Default.args,
  boundingBox: true,
  boundingBoxLabel: "Bounding box label",
};

WithElementLabel.args = {
  id: "Red Selection",
  name: "Red Selection",
  label: (
    <span data-h2-background-color="base(error.lighter)">Red Selection</span>
  ),
};

WithLongText.args = {
  id: "iAgree",
  name: "iAgree",
  label:
    "I agree to share this information with verified Government of Canada hiring managers and HR advisors who have access to this platform.",
  context: "This is a really long string.",
  rules: { required: "This must be accepted to continue." },
};

WithLongText.parameters = {
  viewport: {
    defaultViewport: VIEWPORT.PHONE,
  },
};
