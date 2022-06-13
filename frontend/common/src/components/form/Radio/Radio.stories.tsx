import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Radio from ".";
import type { RadioProps } from ".";
import Form from "../BasicForm";
import Submit from "../Submit";

export default {
  component: Radio,
  title: "Form/Radio",
} as Meta;

const TemplateRadio: Story<RadioProps> = (args) => {
  return (
    <Form onSubmit={action("Submit Form")}>
      <Radio {...args} />
      <Submit />
    </Form>
  );
};

export const IndividualRadio = TemplateRadio.bind({});

IndividualRadio.args = {
  id: "hasDiploma",
  name: "hasDiploma",
  label: "Have a Diploma",
  context: "This will help prove you satisfy education requirements.",
  rules: { required: "This must be accepted to continue." },
};

export const RadioElement = TemplateRadio.bind({});

RadioElement.args = {
  id: "element",
  name: "element",
  label: <span data-h2-background-color="b(error)">Red Selection</span>,
};
