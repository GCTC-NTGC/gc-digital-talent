import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { axe } from "jest-axe";
import IntlProvider from "react-intl/src/components/provider";

const AllTheProviders: FC = ({ children }) => {
  return <IntlProvider locale="en">{children}</IntlProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export const axeTest = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

export * from "@testing-library/react";
export { customRender as render };
