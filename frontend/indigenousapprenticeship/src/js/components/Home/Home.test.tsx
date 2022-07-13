/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import Home from "./Home";

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

const renderHome = () => renderWithReactIntl(<Home />);

describe("Basic test for Home", () => {
  it("should render", () => {
    renderHome();
  });

  it("should have no accessibility errors", async () => {
    const { container } = renderHome();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
