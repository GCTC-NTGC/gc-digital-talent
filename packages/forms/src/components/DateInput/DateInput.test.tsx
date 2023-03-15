/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import DateInput, { DateInputProps } from "./DateInput";

interface FormProps {
  onSubmit: SubmitHandler<FieldValues>;
  defaultValues: FieldValues;
  children: React.ReactNode;
}

const Form = ({ onSubmit, defaultValues, children }: FormProps) => {
  const methods = useForm({ defaultValues });
  const handleSubmit = (data: FieldValues) => onSubmit(data);

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
      <button type="submit">Submit</button>
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
    rules: { required: "This field is required" },
  },
};

const expectAlert = async (text: string | RegExp) => {
  await waitFor(async () => {
    const alert = await screen.getByRole("alert");
    expect(alert).toBeInTheDocument();

    expect(await within(alert).getByText(text)).toBeInTheDocument();
  });
};

describe("DateInput", () => {
  const user = userEvent.setup();

  it("should have no accessibility errors", async () => {
    const { container } = renderDateInput(defaultProps);

    await axeTest(container);
  });

  it("should render subfields", async () => {
    const { rerender } = renderDateInput(defaultProps);

    expect(
      await screen.getByRole("group", { name: "Date" }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("spinbutton", { name: "Year" }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("combobox", { name: "Month" }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("spinbutton", { name: "Day" }),
    ).toBeInTheDocument();

    // Re-render with no day field and confirm it is no longer
    // in the document
    rerender(
      <Form {...defaultProps.formProps}>
        <DateInput
          {...{ ...defaultProps.inputProps, show: ["YEAR", "MONTH"] }}
        />
        <button type="submit">Submit</button>
      </Form>,
    );

    expect(
      await screen.getByRole("spinbutton", { name: /year/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("combobox", { name: /month/i }),
    ).toBeInTheDocument();

    expect(
      await screen.queryByRole("spinbutton", { name: /day/i }),
    ).not.toBeInTheDocument();
  });

  it("should not submit missing required fields", async () => {
    const submitFn = jest.fn();

    renderDateInput({
      formProps: {
        ...defaultProps.formProps,
        onSubmit: submitFn,
      },
      inputProps: defaultProps.inputProps,
    });

    user.click(await screen.getByRole("button", { name: /submit/i }));

    expectAlert(/please enter a valid date/i);
  });

  it("should update hidden input and submit", async () => {
    const submitFn = jest.fn();

    renderDateInput({
      formProps: {
        ...defaultProps.formProps,
        onSubmit: submitFn,
      },
      inputProps: defaultProps.inputProps,
    });

    const year = await screen.getByRole("spinbutton", {
      name: /year/i,
    });

    user.type(year, "2023");
    await waitFor(() => expect(year).toHaveValue(2023));

    const january = await screen.getByRole("option", { name: /january/i });
    const month = await screen.getByRole("combobox", { name: /month/i });

    user.selectOptions(month, january);
    await waitFor(() => expect(month).toHaveValue("01"));

    const day = await screen.getByRole("spinbutton", {
      name: /day/i,
    });

    user.type(day, "1");
    await waitFor(() => expect(day).toHaveValue(1));

    await waitFor(async () => {
      expect(await screen.getByTestId("hidden-date")).toHaveValue("2023-01-1");
    });

    user.click(await screen.getByRole("button", { name: /submit/i }));

    await waitFor(async () => {
      expect(submitFn).toHaveBeenCalledWith({
        date: "2023-01-1",
        dateYear: "2023",
        dateMonth: "01",
        dateDay: "1",
      });
    });
  });

  it("not submit before min range", async () => {
    const submitFn = jest.fn();

    renderDateInput({
      formProps: {
        ...defaultProps.formProps,
        onSubmit: submitFn,
      },
      inputProps: {
        dateRange: {
          min: "2023-02-01",
        },
        ...defaultProps.inputProps,
      },
    });

    const year = await screen.getByRole("spinbutton", {
      name: /year/i,
    });

    user.type(year, "2023");

    const january = await screen.getByRole("option", { name: /january/i });
    const month = await screen.getByRole("combobox", { name: /month/i });

    user.selectOptions(month, january);

    const day = await screen.getByRole("spinbutton", {
      name: /day/i,
    });

    user.type(day, "31");

    user.click(await screen.getByRole("button", { name: /submit/i }));

    expectAlert(/the date must be after or equal to 2023-02-01/i);

    await waitFor(async () => {
      expect(submitFn).not.toHaveBeenCalled();
    });
  });

  it("not submit after max range", async () => {
    const submitFn = jest.fn();

    renderDateInput({
      formProps: {
        ...defaultProps.formProps,
        onSubmit: submitFn,
      },
      inputProps: {
        dateRange: {
          max: "2023-01-31",
        },
        ...defaultProps.inputProps,
      },
    });

    const year = await screen.getByRole("spinbutton", {
      name: /year/i,
    });

    user.type(year, "2023");

    const february = await screen.getByRole("option", { name: /february/i });
    const month = await screen.getByRole("combobox", { name: /month/i });

    user.selectOptions(month, february);

    const day = await screen.getByRole("spinbutton", {
      name: /day/i,
    });

    user.type(day, "01");
    user.click(await screen.getByRole("button", { name: /submit/i }));

    expectAlert(/the date must be before or equal to 2023-01-31/i);

    await waitFor(async () => {
      expect(submitFn).not.toHaveBeenCalled();
    });
  });

  it("not submit invalid date", async () => {
    const submitFn = jest.fn();

    renderDateInput({
      formProps: {
        ...defaultProps.formProps,
        onSubmit: submitFn,
      },
      inputProps: defaultProps.inputProps,
    });

    const year = await screen.getByRole("spinbutton", {
      name: /year/i,
    });

    user.type(year, "2023");

    const february = await screen.getByRole("option", { name: /february/i });
    const month = await screen.getByRole("combobox", { name: /month/i });

    user.selectOptions(month, february);

    const day = await screen.getByRole("spinbutton", {
      name: /day/i,
    });

    user.type(day, "30");
    user.click(await screen.getByRole("button", { name: /submit/i }));

    expectAlert(/please enter a valid date/i);

    await waitFor(async () => {
      expect(submitFn).not.toHaveBeenCalled();
    });
  });
});
