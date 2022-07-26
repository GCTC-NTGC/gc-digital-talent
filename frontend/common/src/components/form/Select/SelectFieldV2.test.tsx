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
  waitFor,
  logRoles,
  getByRole,
} from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import IntlProvider from "react-intl/src/components/provider";
import SelectFieldV2 from "./SelectFieldV2";
import type { SelectFieldV2Props } from "./SelectFieldV2";

const mockSubmit = jest.fn((data) => Promise.resolve(data));

const Providers = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  const onSubmit = async (data: any) => {
    await mockSubmit(data);
    methods.reset();
  };

  return (
    <IntlProvider locale="en">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {children}
          <input type="submit" />
        </form>
      </FormProvider>
    </IntlProvider>
  );
};

// In SelectFieldV2, We hardcode the classNamePrefix prop into react-select's
// Select component to making styling/testing simpler. The default random prefix
// would make this harder.
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

const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Providers, ...options });

const renderComponent = (props: SelectFieldV2Props) =>
  renderWithProviders(<SelectFieldV2 {...props} />);

describe("SelectFieldV2", () => {
  it.only("should render with only label prop", () => {
    renderComponent({
      label: "Foo Bar",
    });
    expect(
      screen.getByRole("combobox", { name: /foo bar/i }),
    ).toBeInTheDocument();
    // Hidden input should exist.
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBe("");
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("name"),
    ).toBe("fooBar");
  });

  it.only("should write proper text in options menu when none provided", () => {
    renderComponent({
      label: "Foo Bar",
      options: [],
    });
    toggleMenuOpen(document.body);
    const noticeText = document.querySelector(
      `.${CLASS_PREFIX}__menu-notice`,
    )?.textContent;
    expect(noticeText).toBe("No options");
  });

  it("should submit empty when no validation rules", async () => {
    renderComponent({
      label: "Foo Bar",
      options: [],
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).toBeCalledTimes(1);
  });

  it.only("should prevent submit and throw custom error message when required rule is provided", async () => {
    renderComponent({
      label: "Foo Bar",
      rules: { required: "Required!" },
    });
    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).not.toBeCalled();
    expect(screen.queryByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert").textContent).toBe("Required!");
  });

  // TODO: Add a default required error message.
  it.only("should prevent submit when required without message (but no default error message)", async () => {
    renderComponent({
      label: "Foo Bar",
      rules: { required: true },
    });
    await act(async () => {
      fireEvent.submit(screen.getByRole("button"));
    });
    expect(mockSubmit).not.toBeCalled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it.only("should show optional text when not required", () => {
    renderComponent({
      label: "Foo Bar",
    });
    expect(screen.getByText("(Optional)")).toBeInTheDocument();
  });

  it.only("should be clearable when not required", () => {
    renderComponent({
      label: "Foo Bar",
      options: [{ value: "BAZ", label: "Baz" }],
    });
    toggleMenuOpen(document.body);
    selectFirstOption(document.body);
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBe("BAZ");
    clickClearIndicator(document.body);
    expect(
      document.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBe("");
  });

  it.skip("should not be clearable when required", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      rules: { required: "Required!" },
    });
  });

  it("should have default placeholder when not specified", () => {
    renderComponent({
      label: "Foo Bar",
    });

    const placeholderText = document.querySelector(
      `.${CLASS_PREFIX}__control`,
    )?.textContent;
    expect(placeholderText).toBe("Select...");
  });

  it("should have custom placeholder when specified", () => {
    renderComponent({
      label: "Foo Bar",
      placeholder: "Select thing...",
    });

    const placeholderText = document.querySelector(
      `.${CLASS_PREFIX}__control`,
    )?.textContent;
    expect(placeholderText).toBe("Select thing...");
  });

  it("should show loading indicator when isLoading", () => {
    renderComponent({
      label: "Foo Bar",
      isLoading: true,
    });

    const loadingIndicator = document.querySelector(
      `.${CLASS_PREFIX}__loading-indicator`,
    );
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("should write proper text in options menu when isLoading", () => {
    renderComponent({
      label: "Foo Bar",
      isLoading: true,
    });
    toggleMenuOpen(document.body);

    const loadingText = document.querySelector(
      `.${CLASS_PREFIX}__menu-notice`,
    )?.textContent;
    expect(loadingText).toBe("Loading...");
  });
});
