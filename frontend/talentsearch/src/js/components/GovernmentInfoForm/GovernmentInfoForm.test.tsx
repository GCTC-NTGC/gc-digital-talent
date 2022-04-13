/**
 * @jest-environment jsdom
 */
import { BasicForm } from "@common/components/form";
import "@testing-library/jest-dom";
import React from "react";
import { fakeClassifications, fakeUsers } from "@common/fakeData";
import { Classification } from "@common/api/generated";
import { UpdateUserAsUserInput, User } from "../../api/generated";
import { render, screen, fireEvent } from "../../tests/testUtils";
import GovInfoFormContainer, {
  GovernmentInfoForm,
  GovernmentInfoFormProps,
} from "./GovernmentInfoForm";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

const mockClassifications = fakeClassifications();
const mockUser = fakeUsers()[0];
const mockSave = jest.fn(() => Promise.resolve(mockUser));
const mockFunction = jest.fn();

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
  test("Can't submit if no fields entered.", async () => {
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

// used Eric's AboutMe component to add further stuff below this point
// aboutMeForm/AboutMeForm.test.tsx

// it("Should submit successfully with required fields", async () => {

//   render(
//     <GovernmentInfoForm
//       initialData={mockUser}
//       classifications={mockClassifications}
//       submitHandler={() => updateFunction}
//     />,

//   fireEvent.submit(screen.getByRole("button", { name: /save/i }));
//   await waitFor(() => {
//     expect(mockSave).toHaveBeenCalled();
//   });
// });
