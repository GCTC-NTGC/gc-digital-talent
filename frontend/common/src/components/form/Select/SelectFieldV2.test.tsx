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
import SelectFieldV2 from "./SelectFieldV2";

const Providers = ({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: SubmitHandler<FieldValues>;
}) => {
  const methods = useForm();

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

function clickClearIndicator(container: HTMLElement) {
  const indicator = container.querySelector(
    `.${CLASS_PREFIX}__clear-indicator`,
  );
  if (indicator) fireEvent.mouseDown(indicator, { button: 0 });
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

describe("SelectFieldV2", () => {
  it("should render properly with only label prop", () => {
    renderWithProviders(<SelectFieldV2 label="Foo Bar" />);
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
    ).toBe("");
  });

  it("should write proper text in options menu when none provided", () => {
    renderWithProviders(<SelectFieldV2 label="Foo Bar" options={[]} />);
    toggleMenuOpen(document.body);
    const noticeText = document.querySelector(
      `.${CLASS_PREFIX}__menu-notice`,
    )?.textContent;
    expect(noticeText).toBe("No options");
  });

  it("should submit empty when no validation rules", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(<SelectFieldV2 label="Foo Bar" options={[]} />, {
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

  it("should prevent submit and throw custom error message when required rule is provided", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <SelectFieldV2
        label="Foo Bar"
        options={[]}
        rules={{ required: "Required!" }}
      />,
      {
        wrapperProps: {
          onSubmit: mockSubmit,
        },
      },
    );
    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).not.toBeCalled();
    expect(screen.queryByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert").textContent).toBe("Required!");
  });

  // TODO: Add a default required error message.
  it("should prevent submit when required without message (but no default error message)", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <SelectFieldV2 label="Foo Bar" options={[]} rules={{ required: true }} />,
      {
        wrapperProps: {
          onSubmit: mockSubmit,
        },
      },
    );
    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).not.toBeCalled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should show 'optional' text when not required", () => {
    renderWithProviders(<SelectFieldV2 label="Foo Bar" />);
    expect(screen.getByText("(Optional)")).toBeInTheDocument();
  });

  it("should show 'required' text when required", () => {
    renderWithProviders(
      <SelectFieldV2 label="Foo Bar" rules={{ required: true }} />,
    );
    expect(screen.getByText("(Required)")).toBeInTheDocument();
  });

  it("should be clearable when not required", () => {
    renderWithProviders(
      <SelectFieldV2
        label="Foo Bar"
        options={[{ value: "BAZ", label: "Baz" }]}
      />,
    );

    // Nothing selected.
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBe("");
    expect(
      document.querySelector(`.${CLASS_PREFIX}__clear-indicator`),
    ).not.toBeInTheDocument();

    // Do selection.
    toggleMenuOpen(document.body);
    selectFirstOption(document.body);

    // Check selection.
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBe("BAZ");
    expect(
      document.querySelector(`.${CLASS_PREFIX}__clear-indicator`),
    ).toBeInTheDocument();

    // Clear selection.
    clickClearIndicator(document.body);
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBe("");
  });

  it("should not be clearable when required", () => {
    renderWithProviders(
      <SelectFieldV2 label="Foo Bar" rules={{ required: "Required!" }} />,
    );
    toggleMenuOpen(document.body);
    selectFirstOption(document.body);
    const clearIndicator = document.querySelector(
      `.${CLASS_PREFIX}__clear-indicator`,
    );
    expect(clearIndicator).not.toBeInTheDocument();
  });

  it("should have default placeholder when not specified", () => {
    renderWithProviders(<SelectFieldV2 label="Foo Bar" />);

    const placeholderText = document.querySelector(
      `.${CLASS_PREFIX}__control`,
    )?.textContent;
    expect(placeholderText).toBe("Select...");
  });

  it("should have custom placeholder when specified", () => {
    renderWithProviders(
      <SelectFieldV2 label="Foo Bar" placeholder="Select thing..." />,
    );

    const placeholderText = document.querySelector(
      `.${CLASS_PREFIX}__control`,
    )?.textContent;
    expect(placeholderText).toBe("Select thing...");
  });

  it("should show loading indicator when isLoading", () => {
    renderWithProviders(<SelectFieldV2 label="Foo Bar" isLoading />);

    const loadingIndicator = document.querySelector(
      `.${CLASS_PREFIX}__loading-indicator`,
    );
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("should write proper text in options menu when isLoading", () => {
    renderWithProviders(<SelectFieldV2 label="Foo Bar" isLoading />);
    toggleMenuOpen(document.body);

    const loadingText = document.querySelector(
      `.${CLASS_PREFIX}__menu-notice`,
    )?.textContent;
    expect(loadingText).toBe("Loading...");
  });

  it("should submit selected value as string by default", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <SelectFieldV2
        label="Foo Bar"
        options={[{ value: "BAZ", label: "Baz" }]}
      />,
      { wrapperProps: { onSubmit: mockSubmit } },
    );
    toggleMenuOpen(document.body);
    selectFirstOption(document.body);

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).toBeCalled();
    expect(mockSubmit).toBeCalledWith({ fooBar: "BAZ" });
  });

  it("should submit a selected value as array when specified", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <SelectFieldV2
        forceArrayFormValue
        label="Foo Bar"
        options={[{ value: "BAZ", label: "Baz" }]}
      />,
      { wrapperProps: { onSubmit: mockSubmit } },
    );
    toggleMenuOpen(document.body);
    selectFirstOption(document.body);

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).toBeCalled();
    expect(mockSubmit).toBeCalledWith({ fooBar: Array("BAZ") });
  });
});
