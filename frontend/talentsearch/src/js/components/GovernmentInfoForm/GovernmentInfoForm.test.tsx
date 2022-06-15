/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import {
  fakeClassifications,
  fakeDepartments,
  fakeUsers,
} from "@common/fakeData";
import { render, screen, fireEvent, waitFor } from "../../tests/testUtils";
import {
  GovInfoFormWithProfileWrapper as GovernmentInfoForm,
  GovInfoFormWithProfileWrapperProps as GovernmentInfoFormProps,
} from "./GovernmentInfoForm";

const mockDepartments = fakeDepartments();
const mockClassifications = fakeClassifications();
const mockUser = fakeUsers()[0];
const mockSave = jest.fn();

const renderGovInfoForm = ({
  initialData,
  departments,
  classifications,
  submitHandler,
}: GovernmentInfoFormProps) => {
  return render(
    <GovernmentInfoForm
      initialData={initialData}
      departments={departments}
      classifications={classifications}
      submitHandler={submitHandler}
    />,
  );
};

describe("Government Info Form tests", () => {
  test("Form conditional rendering", async () => {
    renderGovInfoForm({
      initialData: mockUser,
      departments: mockDepartments,
      classifications: mockClassifications,
      submitHandler: mockSave,
    });

    // Ensure conditional form elements don't exist yet.
    expect(
      screen.queryByRole("combobox", {
        name: /which department do you work for/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("group", {
        name: /employment status/i,
      }),
    ).not.toBeInTheDocument();

    // Open second round of form elements
    fireEvent.click(
      screen.getByRole("radio", {
        name: /i am a government of canada employee/i,
      }),
    );
    expect(
      screen.getByRole("radio", {
        name: /i am a student/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: /Select a department/i,
      }),
    ).toBeInTheDocument();

    // Open the last round of form elements
    fireEvent.click(
      screen.getByRole("radio", {
        name: /i have a term position/i,
      }),
    );
    expect(
      screen.getByRole("checkbox", { name: /lateral deployment/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: /choose group/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: /choose level/i,
      }),
    ).toBeInTheDocument();
  });

  test("Submit functionality", async () => {
    renderGovInfoForm({
      initialData: mockUser,
      departments: mockDepartments,
      classifications: mockClassifications,
      submitHandler: mockSave,
    });
    const isGovEmployee = screen.getByRole("radio", {
      name: /i am a government of canada employee/i,
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
