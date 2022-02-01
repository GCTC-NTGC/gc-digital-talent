import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import IntlProvider from "react-intl/src/components/provider";

const AllTheProviders: FC = ({ children }) => {
  return <IntlProvider locale="en">{children}</IntlProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
