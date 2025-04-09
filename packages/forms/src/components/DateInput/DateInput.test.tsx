/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { ReactNode } from "react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import DateInput, { DateInputProps } from "./DateInput";

interface FormProps {
  onSubmit: SubmitHandler<FieldValues>;
  defaultValues: FieldValues;
  children: ReactNode;
}

const Form = ({ onSubmit, defaultValues, children }: FormProps) => {
  const methods = useForm({ defaultValues, mode: "onSubmit" });
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
    id: "date",
    name: "date",
    legend: "Date",
  },
};

describe("DateInput", () => {
  const user = userEvent.setup();

  it("should have no accessibility errors", async () => {
    const { container } = renderDateInput(defaultProps);

    await axeTest(container);
  });

  it("should render subfields", () => {
    const { rerender } = renderDateInput(defaultProps);

    expect(screen.getByRole("group", { name: "Date" })).toBeInTheDocument();

    expect(
      screen.getByRole("spinbutton", { name: "Year" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("combobox", { name: "Month" })).toBeInTheDocument();

    expect(screen.getByRole("spinbutton", { name: "Day" })).toBeInTheDocument();

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
      screen.getByRole("spinbutton", { name: /year/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", { name: /month/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("spinbutton", { name: /day/i }),
    ).not.toBeInTheDocument();
  });

  it("should not submit missing required fields", async () => {
    const submitFn = jest.fn();

    renderDateInput({
      formProps: {
        ...defaultProps.formProps,
        onSubmit: submitFn,
      },
      inputProps: {
        ...defaultProps.inputProps,
        rules: {
          required: "this field is required",
        },
      },
    });

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
    });
  });

  it("should update input and submit", async () => {
    const submitFn = jest.fn();

    renderDateInput({
      formProps: {
        ...defaultProps.formProps,
        onSubmit: submitFn,
      },
      inputProps: defaultProps.inputProps,
    });

    const year = screen.getByRole("spinbutton", {
      name: /year/i,
    });

    await user.type(year, "2023");
    await waitFor(() => expect(year).toHaveValue(2023));

    const january = screen.getByRole("option", { name: /january/i });
    const month = screen.getByRole("combobox", { name: /month/i });

    await user.selectOptions(month, january);
    await waitFor(() => expect(month).toHaveValue("01"));

    const day = screen.getByRole("spinbutton", {
      name: /day/i,
    });

    await user.type(day, "1");
    await waitFor(() => expect(day).toHaveValue(1));

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(submitFn).toHaveBeenCalledWith({
        date: "2023-01-01",
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
        ...defaultProps.inputProps,
        rules: {
          min: {
            value: "2023-02-01",
            message: "must be after",
          },
        },
      },
    });

    const year = screen.getByRole("spinbutton", {
      name: /year/i,
    });

    await user.type(year, "2023");
    await waitFor(() => expect(year).toHaveValue(2023));

    const january = screen.getByRole("option", { name: /january/i });
    const month = screen.getByRole("combobox", { name: /month/i });

    await user.selectOptions(month, january);
    await waitFor(() => expect(month).toHaveValue("01"));

    const day = screen.getByRole("spinbutton", {
      name: /day/i,
    });

    await user.type(day, "31");
    await waitFor(() => expect(day).toHaveValue(31));

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(within(alert).getByText(/after/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(submitFn).not.toHaveBeenCalled();
    });
  });

  it("doesn't fail min validation on null", async () => {
    const submitFn = jest.fn();

    renderDateInput({
      formProps: {
        ...defaultProps.formProps,
        onSubmit: submitFn,
      },
      inputProps: {
        ...defaultProps.inputProps,
        rules: {
          min: {
            value: "2023-02-01",
            message: "must be after",
          },
        },
      },
    });

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(submitFn).toHaveBeenCalled();
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
        ...defaultProps.inputProps,
        rules: {
          max: {
            value: "2023-02-01",
            message: "Must be before",
          },
        },
      },
    });

    const year = screen.getByRole("spinbutton", {
      name: /year/i,
    });

    await user.type(year, "2023");
    await waitFor(() => expect(year).toHaveValue(2023));

    const february = screen.getByRole("option", { name: /february/i });
    const month = screen.getByRole("combobox", { name: /month/i });

    await user.selectOptions(month, february);
    await waitFor(() => expect(month).toHaveValue("02"));

    const day = screen.getByRole("spinbutton", {
      name: /day/i,
    });

    await user.type(day, "2");
    await waitFor(() => expect(day).toHaveValue(2));

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");

      expect(within(alert).getByText(/before/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(submitFn).not.toHaveBeenCalled();
    });
  });

  it("doesn't fail max validation on null", async () => {
    const submitFn = jest.fn();

    renderDateInput({
      formProps: {
        ...defaultProps.formProps,
        onSubmit: submitFn,
      },
      inputProps: {
        ...defaultProps.inputProps,
        rules: {
          max: {
            value: "2023-02-01",
            message: "Must be before",
          },
        },
      },
    });

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(submitFn).toHaveBeenCalled();
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

    const year = screen.getByRole("spinbutton", {
      name: /year/i,
    });

    await user.type(year, "2023");

    const february = screen.getByRole("option", { name: /february/i });
    const month = screen.getByRole("combobox", { name: /month/i });

    await user.selectOptions(month, february);

    const day = screen.getByRole("spinbutton", {
      name: /day/i,
    });

    await user.type(day, "30");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(
        within(alert).getByText(/please enter a valid date/i),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(submitFn).not.toHaveBeenCalled();
    });
  });
});
