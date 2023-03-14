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
    max: "2024-04-01",
  },
};

export const OnlyYearAndMonth = Template.bind({});
OnlyYearAndMonth.args = {
  idPrefix: "date",
  legend: "Date",
  name: "date",
  show: [DATE_SEGMENT.Year, DATE_SEGMENT.Month],
};
