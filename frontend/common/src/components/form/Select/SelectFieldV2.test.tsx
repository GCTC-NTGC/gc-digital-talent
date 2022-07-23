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
  it("should render with only label prop", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
    });
    expect(
      screen.getByRole("combobox", { name: /foo bar/i }),
    ).toBeInTheDocument();
    // Hidden input should exist.
    expect(
      container.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBe("");
    expect(
      container.querySelector('input[type="hidden"]')?.getAttribute("name"),
    ).toBe("fooBar");
  });

  it("should write proper text in options menu when none provided", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      options: [],
    });
    toggleMenuOpen(container);
    const noticeText = container.querySelector(
      `.${CLASS_PREFIX}__menu-notice`,
    )?.textContent;
    expect(noticeText).toBe("No options");
  });

  it.skip("should submit empty when no rules", () => {
    act(() => {
      const { container } = renderComponent({
        label: "Foo Bar",
        options: [{ value: "BAZ", label: "Baz" }],
      });
      toggleMenuOpen(container);
      selectFirstOption(container);
    });

    act(() => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(mockSubmit).toBeCalled();
  });

  it.skip("should render a validation error when required", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      rules: { required: true },
    });
    getByRole(container, "combobox", { name: /foo bar/i }).focus();
    getByRole(container, "combobox", { name: /foo bar/i }).blur();
    logRoles(container);
    // #TODO Submit or focus/unfocus.
    // #TODO
  });

  it.skip("should render a custom required validation message", async () => {
    renderComponent({
      label: "Foo Bar",
      rules: { required: "Required!" },
    });
    fireEvent.submit(screen.getByRole("button"));
    expect(await screen.getByRole("alert")).toBe("test");
  });

  it.skip("should show optional text when not required", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
    });
  });

  it("should be clearable when not required", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      options: [{ value: "BAZ", label: "Baz" }],
    });
    toggleMenuOpen(container);
    selectFirstOption(container);
    expect(
      container.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBe("BAZ");
    clickClearIndicator(container);
    expect(
      container.querySelector('input[type="hidden"]')?.getAttribute("value"),
    ).toBe("");
  });

  it.skip("should not be clearable when required", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      rules: { required: "Required!" },
    });
  });

  it("should have default placeholder when not specified", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
    });

    const placeholderText = container.querySelector(
      `.${CLASS_PREFIX}__control`,
    )?.textContent;
    expect(placeholderText).toBe("Select...");
  });

  it("should have custom placeholder when specified", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      placeholder: "Select thing...",
    });

    const placeholderText = container.querySelector(
      `.${CLASS_PREFIX}__control`,
    )?.textContent;
    expect(placeholderText).toBe("Select thing...");
  });

  it("should show loading indicator when isLoading", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      isLoading: true,
    });

    const loadingIndicator = container.querySelector(
      `.${CLASS_PREFIX}__loading-indicator`,
    );
    expect(loadingIndicator).toBeInTheDocument();
  });

  it("should write proper text in options menu when isLoading", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      isLoading: true,
    });
    toggleMenuOpen(container);

    const loadingText = container.querySelector(
      `.${CLASS_PREFIX}__menu-notice`,
    )?.textContent;
    expect(loadingText).toBe("Loading...");
  });
});
