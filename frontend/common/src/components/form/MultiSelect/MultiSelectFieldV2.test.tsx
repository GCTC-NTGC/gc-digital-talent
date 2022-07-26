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
import IntlProvider from "react-intl/src/components/provider";
import MultiSelectFieldV2 from "./MultiSelectFieldV2";

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

// In SelectFieldV2, we hardcode the classNamePrefix prop into react-select's
// Select component to making styling/testing simpler.
const CLASS_PREFIX = "react-select";

// Source: https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/__tests__/StateManaged.test.tsx
function toggleMenuOpen(container: HTMLElement) {
  const button = container.querySelector(
    `.${CLASS_PREFIX}__dropdown-indicator`,
  );
  if (button) fireEvent.mouseDown(button, { button: 0 });
}

function selectFirstOption(container: HTMLElement) {
  const menu = container.querySelector(`.${CLASS_PREFIX}__menu`);
  if (menu) fireEvent.keyDown(menu, { keyCode: 13, key: "Enter" });
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

describe("MultiSelectFieldV2", () => {
  it("should render properly with only label prop", () => {
    renderWithProviders(<MultiSelectFieldV2 label="Foo Bar" />);
    expect(
      screen.getByRole("combobox", { name: /foo bar/i }),
    ).toBeInTheDocument();
    // Hidden input should exist.
    expect(document.querySelectorAll('input[type="hidden"]')).toHaveLength(1);
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("name"),
    ).toBe("fooBar");
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBeNull();
  });

  it("should submit undefine when no default (no validation rules)", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(<MultiSelectFieldV2 label="Foo Bar" options={[]} />, {
      wrapperProps: {
        onSubmit: mockSubmit,
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith({ fooBar: undefined });
  });

  it("should submit correctly as array of values", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <MultiSelectFieldV2
        label="Foo Bar"
        options={[
          { value: "BAZ", label: "Baz" },
          { value: "BAM", label: "Bam" },
        ]}
      />,
      {
        wrapperProps: {
          onSubmit: mockSubmit,
          defaultValues: {
            fooBar: [],
          },
        },
      },
    );

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toHaveBeenLastCalledWith({ fooBar: [] });

    // Select first option.
    toggleMenuOpen(document.body);
    selectFirstOption(document.body);

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /submit/i }));
    });
    expect(mockSubmit).toBeCalledTimes(2);
    expect(mockSubmit).toHaveBeenLastCalledWith({ fooBar: ["BAZ"] });

    // Select second option.
    toggleMenuOpen(document.body);
    selectFirstOption(document.body);

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /submit/i }));
    });
    expect(mockSubmit).toBeCalledTimes(3);
    expect(mockSubmit).toHaveBeenLastCalledWith({ fooBar: ["BAZ", "BAM"] });
  });

  it("should be clearable even when required", () => {
    renderWithProviders(
      <MultiSelectFieldV2
        label="Foo Bar"
        rules={{ required: "Required!" }}
        options={[{ value: "BAZ", label: "Baz" }]}
      />,
    );
    toggleMenuOpen(document.body);
    selectFirstOption(document.body);
    const clearIndicator = document.querySelector(
      `.${CLASS_PREFIX}__clear-indicator`,
    );
    expect(clearIndicator).toBeInTheDocument();
  });

  it("should show loading indicator when isLoading", () => {
    renderWithProviders(<MultiSelectFieldV2 label="Foo Bar" isLoading />);

    const loadingIndicator = document.querySelector(
      `.${CLASS_PREFIX}__loading-indicator`,
    );
    expect(loadingIndicator).toBeInTheDocument();
  });
});
