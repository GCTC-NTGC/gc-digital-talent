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
} from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import IntlProvider from "react-intl/src/components/provider";
import SelectFieldV2 from "./SelectFieldV2";
import type { SelectFieldV2Props } from "./SelectFieldV2";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return (
    <IntlProvider locale="en">
      <FormProvider {...methods}>
        <form>
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
const CLASS_NAME_PREFIX = "react-select";

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
    // Hidden input
    expect(container.querySelector('input[type="hidden"]')).toBeTruthy();
    expect(
      container.querySelector('input[type="hidden"]')?.getAttribute("name"),
    ).toBe("fooBar");
  });

  it("should render a validation error when required", () => {});

  it("should render a custom validation message", () => {});

  it("should show optional text when not required", () => {});

  it("should be clearable when not required", () => {});

  it("should not be clearable when required", () => {});

  it("should have default placeholder when not specified", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
    });
    expect(
      container.querySelector(`.${CLASS_NAME_PREFIX}__control`)?.textContent,
    ).toBe("Select...");
  });

  it("should have custom placeholder when specified", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      placeholder: "Select thing...",
    });
    expect(
      container.querySelector(`.${CLASS_NAME_PREFIX}__control`)?.textContent,
    ).toBe("Select thing...");
  });

  it("should show loading indicator when isLoading", () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      isLoading: true,
    });
    expect(
      container.querySelector(`.${CLASS_NAME_PREFIX}__loading-indicator`),
    ).toBeInTheDocument();
  });

  it("should show loading message in options when isLoading", async () => {
    const { container } = renderComponent({
      label: "Foo Bar",
      isLoading: true,
    });
    expect(console.log(container.innerHTML));
    fireEvent.click(
      container.querySelector(".react-select__dropdown-indicator"),
    );
    await waitFor(() => expect(screen.getByRole("option")).toBeInTheDocument());
  });

  it("should have default loading message when not specified", () => {});
});
