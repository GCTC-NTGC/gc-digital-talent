/**
 * @jest-environment jsdom
 */
// This component is not accessible so we cannot use accessible methods to interact with it
/* eslint-disable testing-library/no-node-access */
import React from "react";
import "@testing-library/jest-dom";
import { screen, render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import IntlProvider from "react-intl/src/components/provider";

import MultiSelectField from "./MultiSelectField";

const Providers = ({
  children,
  onSubmit,
  defaultValues,
}: {
  children: React.ReactNode;
  onSubmit: SubmitHandler<FieldValues>;
  defaultValues: FieldValues;
}) => {
  const methods = useForm({ defaultValues });

  return (
    <IntlProvider locale="en">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => onSubmit(data))}>
          {children}
          <input type="submit" />
        </form>
      </FormProvider>
    </IntlProvider>
  );
};

// In MultiSelectFieldBase, we hardcode the classNamePrefix prop into react-select's
// Select component to making styling/testing simpler.
const CLASS_PREFIX = "react-select";
const FIELD_NAME = "select-input";

const defaultProps = {
  name: FIELD_NAME,
  id: FIELD_NAME,
  label: "Foo Bar",
};

// Source: https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/__tests__/StateManaged.test.tsx
async function toggleMenuOpen() {
  const user = userEvent.setup();
  await user.click(screen.getByTestId("react-select-field"));
}

async function selectFirstOption() {
  const user = userEvent.setup();
  await user.keyboard(`{ArrowDown}{Enter}`);
}

// Inspiration: https://github.com/testing-library/react-testing-library/issues/780#issuecomment-687525893
const renderWithProviders = (
  ui: React.ReactElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Omit<RenderOptions, "wrapper"> & { wrapperProps: any },
) =>
  render(ui, {
    // Pass extra props to provider, e.g. mocked onSubmit.
    wrapper: (props) => <Providers {...props} {...options?.wrapperProps} />,
    ...options,
  });

describe("MultiSelectField", () => {
  const user = userEvent.setup();
  it("should render properly with only label prop", () => {
    renderWithProviders(<MultiSelectField {...defaultProps} />);
    expect(
      screen.getByRole("combobox", { name: /foo bar/i }),
    ).toBeInTheDocument();
    // Hidden input should exist.
    expect(document.querySelectorAll('input[type="hidden"]')).toHaveLength(1);
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toEqual("");
  });

  it("should submit undefine when no default (no validation rules)", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(<MultiSelectField {...defaultProps} options={[]} />, {
      wrapperProps: {
        onSubmit: mockSubmit,
      },
    });

    await user.click(screen.getByRole("button"));
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith({ [FIELD_NAME]: undefined });
  });

  it("should submit correctly as array of values", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <MultiSelectField
        {...defaultProps}
        options={[
          { value: "BAZ", label: "Baz" },
          { value: "BAM", label: "Bam" },
        ]}
        doNotSort
      />,
      {
        wrapperProps: {
          onSubmit: mockSubmit,
          defaultValues: {
            [FIELD_NAME]: [],
          },
        },
      },
    );

    await user.click(screen.getByRole("button"));
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toHaveBeenLastCalledWith({ [FIELD_NAME]: [] });

    // Select first option.
    toggleMenuOpen();
    selectFirstOption();

    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(mockSubmit).toBeCalledTimes(2);
    expect(mockSubmit).toHaveBeenLastCalledWith({ [FIELD_NAME]: ["BAZ"] });

    // Select second option.
    toggleMenuOpen();
    selectFirstOption();

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(mockSubmit).toBeCalledTimes(3);
    expect(mockSubmit).toHaveBeenLastCalledWith({
      [FIELD_NAME]: ["BAZ", "BAM"],
    });
  });

  // All of the controls are hidden, so this does not work
  it.skip("should be clearable even when required", () => {
    renderWithProviders(
      <MultiSelectField
        {...defaultProps}
        rules={{ required: "Required!" }}
        options={[{ value: "BAZ", label: "Baz" }]}
      />,
    );
    toggleMenuOpen();
    selectFirstOption();

    expect(
      screen.getByRole("button", { name: /remove baz/i }),
    ).toBeInTheDocument();
  });

  it("should show loading indicator when isLoading", () => {
    renderWithProviders(<MultiSelectField {...defaultProps} isLoading />);

    const loadingIndicator = document.querySelector(
      `.${CLASS_PREFIX}__loading-indicator`,
    );
    expect(loadingIndicator).toBeInTheDocument();
  });
});
