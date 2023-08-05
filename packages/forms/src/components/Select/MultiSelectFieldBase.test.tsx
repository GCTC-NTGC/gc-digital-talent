/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import {
  screen,
  render,
  RenderOptions,
  fireEvent,
  renderHook,
  act,
} from "@testing-library/react";
import { FormProvider, useForm, RegisterOptions } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import IntlProvider from "react-intl/src/components/provider";
import MultiSelectFieldBase, {
  useRulesWithDefaultMessages,
} from "./MultiSelectFieldBase";

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

describe("useRulesWithDefaultMessages", () => {
  // See: https://kentcdodds.com/blog/how-to-test-custom-react-hooks
  function renderHookWithProviders(fieldLabel: string, rules: RegisterOptions) {
    const wrapper = ({ children }: { children: React.ReactElement }) => (
      <IntlProvider locale="en">{children}</IntlProvider>
    );
    const { result } = renderHook(
      () => useRulesWithDefaultMessages(fieldLabel, rules),
      {
        wrapper,
      },
    );

    return result;
  }

  it("return rules unmodified when `required` not specified", () => {
    const newRules = renderHookWithProviders("Some Field", {});
    expect(newRules.current.required).toBeUndefined();
  });

  it("return rules unmodified when `required` is false", () => {
    const newRules = renderHookWithProviders("Some Field", { required: false });
    expect(newRules.current.required).toBe(false);
  });

  it("return default message when `required` is true", () => {
    const newRules = renderHookWithProviders("Some Field", { required: true });
    expect(newRules.current.required).toBe("This field is required.");
    // expect(newRules.current.required).toBe(
    //   "Some Field: This field is required.",
    // );
  });

  it("return custom message when `required` is string", () => {
    const newRules = renderHookWithProviders("Some Field", {
      required: "Required!",
    });
    expect(newRules.current.required).toBe("Required!");
  });
});

describe("MultiSelectFieldBase", () => {
  it("should render properly with only label prop", () => {
    renderWithProviders(<MultiSelectFieldBase {...defaultProps} />);
    expect(
      screen.getByRole("combobox", { name: /foo bar/i }),
    ).toBeInTheDocument();
    // Hidden input should exist.
    expect(document.querySelectorAll('input[type="hidden"]')).toHaveLength(1);
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBe("");
  });

  it("should use `name` when `id` and `label` also provided", () => {
    renderWithProviders(
      <MultiSelectFieldBase {...defaultProps} id="foo" name="bar" />,
    );
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("name"),
    ).toBe("bar");
  });

  it("should write proper text in options menu when none provided", () => {
    renderWithProviders(
      <MultiSelectFieldBase {...defaultProps} options={[]} />,
    );
    toggleMenuOpen(document.body);
    const noticeText = document.querySelector(
      `.${CLASS_PREFIX}__menu-notice`,
    )?.textContent;
    expect(noticeText).toBe("No options");
  });

  it("should submit undefined when no selection (no validation rules)", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <MultiSelectFieldBase {...defaultProps} options={[]} />,
      {
        wrapperProps: {
          onSubmit: mockSubmit,
        },
      },
    );

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith({ [FIELD_NAME]: undefined });
  });

  it("should submit default when set and no selection (no validation rules)", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <MultiSelectFieldBase {...defaultProps} options={[]} />,
      {
        wrapperProps: {
          onSubmit: mockSubmit,
          defaultValues: {
            fooBar: "",
          },
        },
      },
    );

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith({ fooBar: "" });
  });

  it("should prevent submit when required and throw custom error message", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <MultiSelectFieldBase
        {...defaultProps}
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
  });

  it("should prevent submit when required and throw default error message", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <MultiSelectFieldBase
        {...defaultProps}
        options={[]}
        rules={{ required: "required" }}
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
    expect(
      screen.getByRole("combobox", {
        description: /required/i,
      }),
    ).toBeInTheDocument();
  });

  it("should show 'required' text when required", () => {
    renderWithProviders(
      <MultiSelectFieldBase {...defaultProps} rules={{ required: true }} />,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should be clearable when not required", () => {
    renderWithProviders(
      <MultiSelectFieldBase
        {...defaultProps}
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
      <MultiSelectFieldBase
        {...defaultProps}
        rules={{ required: "Required!" }}
      />,
    );
    toggleMenuOpen(document.body);
    selectFirstOption(document.body);
    const clearIndicator = document.querySelector(
      `.${CLASS_PREFIX}__clear-indicator`,
    );
    expect(clearIndicator).not.toBeInTheDocument();
  });

  it("should have default placeholder when not specified", () => {
    renderWithProviders(<MultiSelectFieldBase {...defaultProps} />);

    const placeholderText = document.querySelector(
      `.${CLASS_PREFIX}__control`,
    )?.textContent;
    expect(placeholderText).toBe("Select");
  });

  it("should have custom placeholder when specified", () => {
    renderWithProviders(
      <MultiSelectFieldBase {...defaultProps} placeholder="Select thing" />,
    );

    const placeholderText = document.querySelector(
      `.${CLASS_PREFIX}__control`,
    )?.textContent;
    expect(placeholderText).toBe("Select thing");
  });

  it("should show loading indicator when isLoading", () => {
    renderWithProviders(<MultiSelectFieldBase {...defaultProps} isLoading />);

    const loadingIndicator = document.querySelector(
      `.${CLASS_PREFIX}__loading-indicator`,
    );
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("should write proper text in options menu when isLoading", () => {
    renderWithProviders(<MultiSelectFieldBase {...defaultProps} isLoading />);
    toggleMenuOpen(document.body);

    const loadingText = document.querySelector(
      `.${CLASS_PREFIX}__menu-notice`,
    )?.textContent;
    expect(loadingText).toBe("Loading...");
  });

  it("should submit selected value as string by default", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <MultiSelectFieldBase
        {...defaultProps}
        options={[{ value: "BAZ", label: "Baz" }]}
      />,
      { wrapperProps: { onSubmit: mockSubmit } },
    );
    toggleMenuOpen(document.body);
    selectFirstOption(document.body);

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).toBeCalledTimes(1);
    expect(mockSubmit).toBeCalledWith({ [FIELD_NAME]: "BAZ" });
  });

  it("should submit a selected value as array when specified", async () => {
    const mockSubmit = jest.fn();
    renderWithProviders(
      <MultiSelectFieldBase
        forceArrayFormValue
        {...defaultProps}
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
    expect(mockSubmit).toBeCalledWith({ [FIELD_NAME]: Array("BAZ") });
  });
});
