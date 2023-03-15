import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import DateInput from "./DateInput";
import Form from "../BasicForm";
import Submit from "../Submit";
import { DATE_SEGMENT } from "./types";

export default {
  component: DateInput,
  title: "Form/Date Input",
  argTypes: {
    show: {
      control: {
        type: "check",
        labels: {
          [DATE_SEGMENT.Year]: "Year",
          [DATE_SEGMENT.Month]: "Month",
          [DATE_SEGMENT.Day]: "Day",
        },
      },
      options: [DATE_SEGMENT.Year, DATE_SEGMENT.Month, DATE_SEGMENT.Day],
    },
  },
} as ComponentMeta<typeof DateInput>;

const Template: ComponentStory<typeof DateInput> = (args) => {
  return (
    <Form
      options={{ mode: "onSubmit" }}
      onSubmit={(data) => action("Submit Form")(data)}
    >
      <DateInput {...args} />
      <Submit />
    </Form>
  );
};

export const Default = Template.bind({});
Default.args = {
  legend: "Date",
  name: "date",
};

export const Required = Template.bind({});
Required.args = {
  legend: "Date",
  name: "date",
  rules: {
    required: "This field is required",
  },
};

export const WithinRange = Template.bind({});
WithinRange.args = {
  legend: "Date",
  name: "date",
  rules: {
    required: "This field is required",
    min: {
      value: "2023-01-01",
      message: "Must be after 2023-01-01",
    },
    max: {
      value: "2024-01-01",
      message: "Must be before 2024-01-01",
    },
  },
};

export const OnlyYearAndMonth = Template.bind({});
OnlyYearAndMonth.args = {
  legend: "Date",
  name: "date",
  show: [DATE_SEGMENT.Year, DATE_SEGMENT.Month],
};
