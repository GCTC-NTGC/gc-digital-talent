/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { fakeUsers } from "@common/fakeData";
import { axeTest } from "@common/helpers/testUtils";
import { AboutMeForm, AboutMeFormProps } from "./AboutMeForm";

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

const renderAboutMeForm = ({
  initialUser,
  onUpdateAboutMe,
}: AboutMeFormProps) =>
  renderWithReactIntl(
    <AboutMeForm initialUser={initialUser} onUpdateAboutMe={onUpdateAboutMe} />,
  );

describe("AboutMeForm", () => {
  it("should have no accessibility errors", async () => {
    const mockSave = jest.fn();
    await act(async () => {
      const { container } = renderAboutMeForm({
        initialUser: mockUser,
        onUpdateAboutMe: mockSave,
      });
      await axeTest(container);
    });
  });

  it("should render fields", async () => {
    const mockSave = jest.fn();

    await act(async () => {
      renderAboutMeForm({
        initialUser: mockUser,
        onUpdateAboutMe: mockSave,
      });
    });

    expect(
      await screen.getByRole("radio", { name: /english/i }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("radio", { name: /french/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("combobox", { name: /province/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("textbox", { name: /city/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("textbox", { name: /telephone/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("textbox", { name: /first name/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("textbox", { name: /last name/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("textbox", { name: /email/i }),
    ).toBeInTheDocument();
  });

  it("Should not submit with empty fields.", async () => {
    const mockSave = jest.fn();
    renderAboutMeForm({
      initialUser: {
        id: "",
        preferredLang: undefined,
        currentProvince: undefined,
        currentCity: undefined,
        telephone: "",
        firstName: "",
        lastName: "",
        email: "",
      },
      onUpdateAboutMe: mockSave,
    });

    fireEvent.submit(await screen.getByRole("button", { name: /save/i }));
    expect(await screen.findAllByRole("alert")).toHaveLength(8);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("Should submit successfully with required fields", async () => {
    const mockSave = jest.fn(() => Promise.resolve(mockUser));

    renderAboutMeForm({
      initialUser: mockUser,
      onUpdateAboutMe: mockSave,
    });

    fireEvent.submit(await screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
