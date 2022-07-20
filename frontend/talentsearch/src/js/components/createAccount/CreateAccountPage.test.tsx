/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { fakeClassifications, fakeDepartments } from "@common/fakeData";
import React from "react";
import { axeTest, render } from "@common/helpers/testUtils";
import { CreateAccountForm, CreateAccountFormProps } from "./CreateAccountPage";

const mockDepartments = fakeDepartments();
const mockClassifications = fakeClassifications();
const mockSave = jest.fn();

const renderCreateAccountForm = ({
  departments,
  classifications,
  handleCreateAccount,
}: CreateAccountFormProps) =>
  render(
    <CreateAccountForm
      departments={departments}
      classifications={classifications}
      handleCreateAccount={handleCreateAccount}
    />,
  );

describe("Create Account Form tests", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderCreateAccountForm({
      departments: mockDepartments,
      classifications: mockClassifications,
      handleCreateAccount: mockSave,
    });

    await axeTest(container);
  });

  it("should render fields", () => {
    renderCreateAccountForm({
      departments: mockDepartments,
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
      screen.getByRole("group", {
        name: /currently work for the government of canada/i,
      }),
    ).toBeInTheDocument();

    // Government info fields conditional rendering is tested in GovernmentInfoForm.test.tsx
  });

  it("should not render with empty fields.", async () => {
    renderCreateAccountForm({
      departments: mockDepartments,
      classifications: mockClassifications,
      handleCreateAccount: mockSave,
    });

    fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findAllByRole("alert")).toHaveLength(4);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("should submit successfully with required fields", async () => {
    renderCreateAccountForm({
      departments: mockDepartments,
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
      name: /i am a government of canada employee/i,
    });
    fireEvent.click(isGovEmployee);

    const department = screen.getByRole("combobox", {
      name: /which department do you work for/i,
    }) as HTMLSelectElement;
    const options = Array.from(
      department.querySelectorAll("option"),
    ) as HTMLOptionElement[];
    fireEvent.change(department, { target: { value: options[1].value } }); // Set to second value after null selection.

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
