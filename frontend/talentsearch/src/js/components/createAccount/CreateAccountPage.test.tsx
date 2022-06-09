/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { fakeClassifications } from "@common/fakeData";
import React from "react";
import { CreateAccountForm, CreateAccountFormProps } from "./CreateAccountPage";

const mockClassifications = fakeClassifications();
const mockSave = jest.fn();

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

const renderCreateAccountForm = ({
  classifications,
  handleCreateAccount,
}: CreateAccountFormProps) => (
  <>
    {renderWithReactIntl(
      <CreateAccountForm
        classifications={classifications}
        handleCreateAccount={handleCreateAccount}
      />,
    )}
  </>
);

describe("Create Account Form tests", () => {
  it("should render fields", () => {
    renderCreateAccountForm({
      classifications: mockClassifications,
      handleCreateAccount: mockSave,
    });

    expect(
      screen.getByRole("textbox", { name: /given name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /surname/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();

    expect(
      screen.getByRole("group", { name: /preferred contact language/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", { name: /goc employee status/i }),
    ).toBeInTheDocument();

    // Government info fields conditional rendering is tested in GovernmentInfoForm.test.tsx
  });

  it("should not render with empty fields.", async () => {
    renderCreateAccountForm({
      classifications: mockClassifications,
      handleCreateAccount: mockSave,
    });

    fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findAllByRole("alert")).toHaveLength(4);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("should submit successfully with required fields", async () => {
    renderCreateAccountForm({
      classifications: mockClassifications,
      handleCreateAccount: mockSave,
    });

    const firstName = screen.getByRole("textbox", { name: /given name/i });
    fireEvent.change(firstName, { target: { value: "FirstName" } });

    const lastName = screen.getByRole("textbox", { name: /surname/i });
    fireEvent.change(lastName, { target: { value: "LastName" } });

    const email = screen.getByRole("textbox", { name: /email/i });
    fireEvent.change(email, { target: { value: "email@test.com" } });

    const preferredLangEnglish = screen.getByRole("radio", {
      name: /english/i,
    });
    fireEvent.click(preferredLangEnglish);

    const isGovEmployee = screen.getByRole("radio", {
      name: /yes, i am a government of canada employee/i,
    });
    fireEvent.click(isGovEmployee);

    const isStudent = screen.getByRole("radio", {
      name: /i am a student/i,
    });
    fireEvent.click(isStudent);

    fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
