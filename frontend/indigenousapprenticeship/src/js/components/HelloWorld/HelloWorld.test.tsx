/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import HelloWorld from "./HelloWorld";

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

const renderHelloWorld = () => (
  <>
    {renderWithReactIntl(
      <HelloWorld />,
    )}
  </>
);

describe("Basic test for HelloWorld", () => {
  it("should render", () => {
    renderHelloWorld();
  });

});
