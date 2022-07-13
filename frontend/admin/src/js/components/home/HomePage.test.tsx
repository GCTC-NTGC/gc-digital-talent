/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import HomePage from "./HomePage";

const renderWithReactIntl = (
  component: React.ReactNode,
  locale?: "en" | "fr",
  messages?: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  return render(
    <IntlProvider locale={locale || "en"} messages={messages}>
      {component}
    </IntlProvider>,
  );
};

const renderHomePage = () => renderWithReactIntl(<HomePage />);

describe("Basic test for Home Page", () => {
  it("should render", () => {
    renderHomePage();
  });

  it("should have no accessibility errors", async () => {
    const { container } = renderHomePage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
