import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import DateInput from "./DateInput";
import Form from "../BasicForm";
import Submit from "../Submit";

export default {
  component: DateInput,
  title: "Form/Date Input",
} as ComponentMeta<typeof DateInput>;

const Template: ComponentStory<typeof DateInput> = (args) => {
  return (
    <Form onSubmit={(data) => action("Submit Form")(data)}>
      <DateInput {...args} />
      <Submit />
    </Form>
  );
};

export const Default = Template.bind({});
Default.args = {
  idPrefix: "date",
  legend: "Date",
  name: "date",
};

export const WithinRange = Template.bind({});
WithinRange.args = {
  idPrefix: "date",
  legend: "Date",
  name: "date",
  dateRange: {
    min: "2023-03-01",
    max: "2023-04-01",
  },
};
