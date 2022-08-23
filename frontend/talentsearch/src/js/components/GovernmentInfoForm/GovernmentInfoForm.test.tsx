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
import { act } from "react-dom/test-utils";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  axeTest,
} from "@common/helpers/testUtils";
import {
  GovInfoFormWithProfileWrapper as GovernmentInfoForm,
  GovInfoFormWithProfileWrapperProps as GovernmentInfoFormProps,
} from "./GovernmentInfoForm";

const mockDepartments = fakeDepartments();
const mockClassifications = fakeClassifications();
const mockUser = fakeUsers()[0];
const mockSave = jest.fn((data) => Promise.resolve(data));

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

describe("GovernmentInfoForm", () => {
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderGovInfoForm({
        initialData: mockUser,
        departments: mockDepartments,
        classifications: mockClassifications,
        submitHandler: mockSave,
      });

      await axeTest(container);
    });
  });

  it("should render the form", async () => {
    await act(async () => {
      renderGovInfoForm({
        initialData: mockUser,
        departments: mockDepartments,
        classifications: mockClassifications,
        submitHandler: mockSave,
      });
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
      await screen.getByRole("radio", {
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

  it("should submit the form", async () => {
    await act(async () => {
      renderGovInfoForm({
        initialData: mockUser,
        departments: mockDepartments,
        classifications: mockClassifications,
        submitHandler: mockSave,
      });
    });
    const isGovEmployee = await screen.getByRole("radio", {
      name: /i am a government of canada employee/i,
    });
    fireEvent.click(isGovEmployee);

    const termPos = await screen.getByRole("radio", {
      name: /i have a term position/i,
    });
    fireEvent.click(termPos); // Open the other forms

    expect(await screen.getByText("Current Classification Group")).toBeTruthy();

    const isStudent = await screen.getByRole("radio", {
      name: /i am a student/i,
    });
    fireEvent.click(isStudent);

    fireEvent.submit(await screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
