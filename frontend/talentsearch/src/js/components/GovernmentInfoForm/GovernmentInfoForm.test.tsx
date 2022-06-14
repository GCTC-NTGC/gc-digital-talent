/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { fakeClassifications, fakeUsers } from "@common/fakeData";
import { act } from "react-dom/test-utils";
import { render, screen, fireEvent, waitFor } from "../../tests/testUtils";
import {
  GovInfoFormWithProfileWrapper as GovernmentInfoForm,
  GovInfoFormWithProfileWrapperProps as GovernmentInfoFormProps,
} from "./GovernmentInfoForm";

const mockClassifications = fakeClassifications();
const mockUser = fakeUsers()[0];
const mockSave = jest.fn();

const renderGovInfoForm = ({
  initialData,
  classifications,
  submitHandler,
}: GovernmentInfoFormProps) => {
  return render(
    <GovernmentInfoForm
      initialData={initialData}
      classifications={classifications}
      submitHandler={submitHandler}
    />,
  );
};

describe("GovernmentInfoForm", () => {
  it("should render the form", async () => {
    await act(async () => {
      renderGovInfoForm({
        initialData: mockUser,
        classifications: mockClassifications,
        submitHandler: mockSave,
      });
    });

    const isGovEmployee = await screen.getByRole("radio", {
      name: /yes, i am a government of canada employee/i,
    });

    expect(await screen.queryByText("I am a student")).toBeNull();
    fireEvent.click(isGovEmployee); // Open the second form

    expect(
      await screen.getByRole("radio", {
        name: /i am a student/i,
      }),
    ).toBeTruthy();

    const termPos = await screen.getByRole("radio", {
      name: /i have a term position/i,
    });
    fireEvent.click(termPos); // Open the other forms

    expect(
      await screen.getByText(
        "Please indicate if you are interested in lateral deployment or secondment. Learn more about this.",
      ),
    ).toBeTruthy();

    expect(await screen.getByText("Current Classification Group")).toBeTruthy();
  });

  it("should submit the form", async () => {
    await act(async () => {
      renderGovInfoForm({
        initialData: mockUser,
        classifications: mockClassifications,
        submitHandler: mockSave,
      });
    });

    const isGovEmployee = await screen.getByRole("radio", {
      name: /yes, i am a government of canada employee/i,
    });
    fireEvent.click(isGovEmployee);

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
