/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import AboutMeForm from "./AboutMeForm";
import type { FormValues } from "./AboutMeForm";

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

const renderAboutMeForm = () => (
  <>{renderWithReactIntl(<AboutMeForm onSubmit={async () => null} />)}</>
);

describe("AboutMeForm", () => {
  it("should render fields", () => {
    renderAboutMeForm();

    expect(screen.getByRole("radio", { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /french/i })).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", { name: /province/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: /city/i })).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /telephone/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /first name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /last name/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
  });
});
