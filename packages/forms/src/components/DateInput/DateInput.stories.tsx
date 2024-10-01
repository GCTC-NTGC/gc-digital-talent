import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { isAfter } from "date-fns/isAfter";
import { parseISO } from "date-fns/parseISO";

import {
  formatDate,
  formDateStringToDate,
  DATE_FORMAT_STRING,
} from "@gc-digital-talent/date-helpers";
import { Pool } from "@gc-digital-talent/graphql";
import { Pending } from "@gc-digital-talent/ui";
import { fakePools } from "@gc-digital-talent/fake-data";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import Input from "../Input/Input";
import { DATE_SEGMENT } from "./types";
import DateInput, { DateInputProps } from "./DateInput";

export default {
  component: DateInput,
  args: {
    name: "date",
    id: "date",
    legend: "Date",
  },
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
};

type DateInputArgs = typeof DateInput;
type DefaultValueDateInputArgs = DateInputArgs & {
  defaultValue?: string;
};

const Template: StoryFn<DefaultValueDateInputArgs> = (args) => {
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
      <DateInput {...rest} />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </Form>
  );
};

export const Default = Template.bind({});
Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
  },
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  defaultValue: "2023-02-03",
};

export const Required = Template.bind({});
Required.args = {
  rules: {
    required: "This field is required",
  },
};

export const WithinRange = Template.bind({});
WithinRange.args = {
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
  show: [DATE_SEGMENT.Year, DATE_SEGMENT.Month],
};

const ValidationDependantInputs = ({
  name,
  id,
  legend,
  ...rest
}: DateInputProps) => {
  const { watch } = useFormContext<Record<string, string>>();
  const watchFirstInput = watch(name);

  return (
    <>
      <DateInput {...{ name, id, legend }} {...rest} />
      <DateInput
        name={`${name}Two`}
        id={`${id}Two`}
        legend={`${legend?.toString()} Two`}
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

const ValidationDependantTemplate: StoryFn<DateInputArgs> = (args) => (
  <Form
    options={{ mode: "onSubmit" }}
    onSubmit={(data) => action("Submit Form")(data)}
  >
    <ValidationDependantInputs {...args} />
    <Submit data-h2-margin="base(x1, 0, 0, 0)" />
  </Form>
);

export const SecondComesAfterFirst = ValidationDependantTemplate.bind({});

const RenderDependantInput = ({ name }: Pick<DateInputProps, "name">) => {
  const { watch } = useFormContext<Record<string, string>>();
  const watchFirstInput = watch(name);
  const inputDate = watchFirstInput
    ? formDateStringToDate(watchFirstInput)
    : null;

  return inputDate && isAfter(new Date(), inputDate) ? (
    <Input type="text" id="signature" name="signature" label="Signature" />
  ) : (
    <p data-h2-color="base(black)" data-h2-margin="base(x1, 0)">
      Please select a date in the past to continue.
    </p>
  );
};

const RenderDependantTemplate: StoryFn<DateInputArgs> = (args) => {
  const { name, ...rest } = args;
  return (
    <Form
      options={{ mode: "onSubmit" }}
      onSubmit={(data) => action("Submit Form")(data)}
    >
      <DateInput name={name} {...rest} />
      <RenderDependantInput name={name} />
      <p data-h2-margin="base(x1, 0, 0, 0)">
        <Submit />
      </p>
    </Form>
  );
};

export const HideInputWhenInvalid = RenderDependantTemplate.bind({});

type AsyncArgs = DateInputProps & {
  mockQuery: () => Promise<Pool>;
};

const AsyncTemplate: StoryFn<AsyncArgs> = (args) => {
  const intl = useIntl();
  const { mockQuery, ...rest } = args;
  const [fetching, setFetching] = useState<boolean>(false);
  const [pool, setPool] = useState<Pool | null>(null);

  useEffect(() => {
    setFetching(true);
    mockQuery()
      .then((res: Pool) => {
        setPool(res);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [mockQuery]);

  return (
    <Pending fetching={fetching}>
      <Form
        options={{
          mode: "onSubmit",
          defaultValues: {
            [rest.name]: pool?.closingDate
              ? formatDate({
                  date: parseISO(pool?.closingDate),
                  formatString: DATE_FORMAT_STRING,
                  intl,
                })
              : undefined,
          },
        }}
        onSubmit={(data) => action("Submit Form")(data)}
      >
        <DateInput {...rest} />
        <p data-h2-margin="base(x1, 0, 0, 0)">
          <Submit />
        </p>
      </Form>
    </Pending>
  );
};

const mockPool = fakePools(1)[0];

export const AsyncDefaultValue = AsyncTemplate.bind({});
AsyncDefaultValue.args = {
  mockQuery: async (): Promise<Pool> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPool);
      }, 1000);
    });
  },
};
AsyncDefaultValue.parameters = {
  chromatic: { delay: 1500 },
};
