/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { fakeUsers } from "@common/fakeData";
import type { User } from "../../api/generated";
import AboutMeForm, { AboutMeFormProps } from "./AboutMeForm";
import type { FormValues } from "./AboutMeForm";

const mockUser = fakeUsers()[0];

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

const renderAboutMeForm = (props: AboutMeFormProps) => (
  <>{renderWithReactIntl(<AboutMeForm {...props} />)}</>
);

describe("AboutMeForm", () => {
  it("should render fields", () => {
    renderAboutMeForm({
      me: mockUser,
      onSubmit: async () => null,
    });

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

  it("Should not submit with empty fields.", async () => {
    const mockSave = jest.fn();
    renderAboutMeForm({
      me: {
        id: "",
        preferredLang: null,
        currentProvince: null,
        currentCity: null,
        telephone: null,
        firstName: "",
        lastName: "",
        email: "",
      },
      onSubmit: mockSave,
    });

    fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findAllByRole("alert")).toHaveLength(7);
    expect(mockSave).not.toHaveBeenCalled();
  });
});
