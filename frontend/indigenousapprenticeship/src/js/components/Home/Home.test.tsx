/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

const renderHome = () => (
  <>
    {renderWithReactIntl(
      <Home />,
    )}
  </>
);

describe("Basic test for Home", () => {
  it("should render", () => {
    renderHome();
  });

});
