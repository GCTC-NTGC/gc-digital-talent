import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { isBefore } from "date-fns";

import { formDateStringToDate } from "@gc-digital-talent/date-helpers";

import DateInput, { DateInputProps } from "./DateInput";
import Form from "../BasicForm";
import Submit from "../Submit";
import { DATE_SEGMENT } from "./types";
import { useWatch } from "react-hook-form";
import Input from "../Input/Input";

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

type DateInputArgs = typeof DateInput & { defaultValue?: string };

const Template: ComponentStory<DateInputArgs> = (args) => {
  const { defaultValue, ...rest } = args;
  return (
    <Form
      {...(defaultValue && {
        options: {
          defaultValues: {
            [rest.name]: defaultValue,
          },
        },
      })}
      onSubmit={(data) => action("Submit Form")(data)}
    >
      <DateInput {...rest} />
      <Submit />
    </Form>
  );
};

export const Default = Template.bind({});
Default.args = {
  legend: "Date",
  name: "date",
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  legend: "Date",
  name: "date",
  defaultValue: "2023-02-03",
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

const ValidationDependantInputs = ({
  name,
  id,
  legend,
  ...rest
}: DateInputProps) => {
  const watchFirstInput = useWatch({ name });

  return (
    <>
      <DateInput {...{ name, id, legend }} {...rest} />
      <DateInput
        name={`${name}Two`}
        id={`${id}Two`}
        legend={`${legend} Two`}
        rules={{
          min: {
            value: watchFirstInput,
            message: `Must be after ${watchFirstInput}`,
          },
        }}
      />
    </>
  );
};

const ValidationDependantTemplate: ComponentStory<DateInputArgs> = (args) => {
  const { defaultValue, ...rest } = args;
  return (
    <Form
      options={{ mode: "onChange" }}
      onSubmit={(data) => action("Submit Form")(data)}
    >
      <ValidationDependantInputs {...rest} />
      <Submit />
    </Form>
  );
};

export const SecondComesAfterFirst = ValidationDependantTemplate.bind({});
SecondComesAfterFirst.args = {
  name: "date",
  id: "date",
  legend: "Date",
};

const RenderDependantInput = ({ name }: Pick<DateInputProps, "name">) => {
  const watchFirstInput = useWatch({ name });
  const inputDate = watchFirstInput
    ? formDateStringToDate(watchFirstInput)
    : null;

  return inputDate && isBefore(new Date(), inputDate) ? (
    <Input type="text" id="signature" name="signature" label="Signature" />
  ) : (
    <p data-h2-margin="base(x1, 0)">Please select a date in the past to continue.</p>
  );
};

const RenderDependantTemplate: ComponentStory<DateInputArgs> = (args) => {
  const { defaultValue, ...rest } = args;
  return (
    <Form
      options={{ mode: "onChange" }}
      onSubmit={(data) => action("Submit Form")(data)}
    >
      <DateInput {...rest} />
      <RenderDependantInput name={rest.name} />
      <Submit />
    </Form>
  );
};

export const HideInputWhenInvalid = RenderDependantTemplate.bind({});
HideInputWhenInvalid.args = {
  name: "date",
  id: "date",
  legend: "Date",
};
