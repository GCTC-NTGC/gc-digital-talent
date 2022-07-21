/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { screen, render, RenderOptions, act } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import IntlProvider from "react-intl/src/components/provider";
import SelectFieldV2 from "./SelectFieldV2";
import type { SelectFieldV2Props } from "./SelectFieldV2";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return (
    <IntlProvider locale="en">
      <FormProvider {...methods}>{children}</FormProvider>
    </IntlProvider>
  );
};

const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Providers, ...options });

const renderComponent = (props: SelectFieldV2Props) =>
  renderWithProviders(<SelectFieldV2 {...props} />);

describe("SelectFieldV2", () => {
  it("should render with only label prop", async () => {
    await act(async () => {
      renderComponent({
        label: "Foo Bar",
      });
    });
    expect(
      await screen.getByRole("combobox", { name: /foo bar/i }),
    ).toBeInTheDocument();
  });
});
