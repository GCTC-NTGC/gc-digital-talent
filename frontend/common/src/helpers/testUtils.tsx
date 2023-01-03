import "../tests/matchMeta.mock";
import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { axe } from "jest-axe";
import IntlProvider from "react-intl/src/components/provider";
import { BrowserRouter } from "react-router-dom";
import defaultRichTextElements from "./format";

const Providers: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  window.history.pushState({}, "Test page", "/");

  return (
    <IntlProvider locale="en" defaultRichTextElements={defaultRichTextElements}>
      <BrowserRouter>{children}</BrowserRouter>
    </IntlProvider>
  );
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
