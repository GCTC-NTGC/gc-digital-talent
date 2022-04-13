/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { fakeClassifications, fakeUsers } from "@common/fakeData";
import { render, screen, fireEvent } from "../../tests/testUtils";
import {
  GovernmentInfoForm,
  GovernmentInfoFormProps,
} from "./GovernmentInfoForm";

const mockClassifications = fakeClassifications();
const mockUser = fakeUsers()[0];

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

describe("Government Info Form tests", () => {
  test("Form function", async () => {
    renderGovInfoForm({
      initialData: mockUser,
      classifications: mockClassifications,
      submitHandler: jest.fn(),
    });

    const button = screen.getByText(
      "Yes, I am a Government of Canada employee",
    );
    const studentNotPresent = screen.queryByText("I am a student");
    expect(studentNotPresent).toBeNull();
    fireEvent.click(button); // Open the second form
    expect(screen.getByText("I am a student")).toBeTruthy();

    const button2 = screen.getByText("I have a term position");
    fireEvent.click(button2); // Open the other forms
    expect(
      screen.getByText(
        "Please indicate if you are interested in lateral deployment or secondment. Learn more about this.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Current Classification Group")).toBeTruthy();
  });
});
