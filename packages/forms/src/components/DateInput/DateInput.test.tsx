/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import {
  screen,
  render,
  RenderOptions,
  act,
  fireEvent,
} from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import DateInput, { DateInputProps } from "./DateInput";
import Submit from "../Submit";

interface FormProps {
  onSubmit: SubmitHandler<FieldValues>;
  defaultValues: FieldValues;
  children: React.ReactNode;
}

const Form = ({ onSubmit, defaultValues, children }: FormProps) => {
  const methods = useForm({ defaultValues });

  const handleSubmit = (data: FieldValues) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>{children}</form>
    </FormProvider>
  );
};

interface RenderDateInputProps {
  formProps: Omit<FormProps, "children">;
  inputProps: DateInputProps;
}

const renderDateInput = ({ formProps, inputProps }: RenderDateInputProps) =>
  renderWithProviders(
    <Form {...formProps}>
      <DateInput {...inputProps} />
      <Submit />
    </Form>,
  );

const mockSubmit = jest.fn();

const defaultProps: RenderDateInputProps = {
  formProps: {
    onSubmit: mockSubmit,
    defaultValues: {
      date: "",
    },
  },
  inputProps: {
    idPrefix: "date",
    name: "date",
    legend: "Date",
  },
};

describe("DateInput", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderDateInput(defaultProps);

    await axeTest(container);
  });
});
