import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { axe } from "jest-axe";
import IntlProvider from "react-intl/src/components/provider";

const Providers: React.FC = ({ children }) => {
  return <IntlProvider locale="en">{children}</IntlProvider>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Providers, ...options });

export const axeTest = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

export * from "@testing-library/react";
export { customRender as render };
