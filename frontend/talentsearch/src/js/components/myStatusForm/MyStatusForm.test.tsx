/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { fakeUsers } from "@common/fakeData";
import {
  GetMystatusQuery,
  WorkRegion,
  JobLookingStatus,
  User,
} from "../../api/generated";
import { render, screen, fireEvent, act, waitFor } from "../../tests/testUtils";
import { MyStatusForm, MyStatusFormProps } from "./MyStatusForm";

const renderMyStatusForm = ({
  initialData,
  handleMyStatus,
}: MyStatusFormProps) => {
  return render(
    <MyStatusForm initialData={initialData} handleMyStatus={handleMyStatus} />,
  );
};
const mockUser = fakeUsers()[0];

const mockInitialData: User = {
  id: "thanka11",
  jobLookingStatus: JobLookingStatus.ActivelyLooking,
  email: "",
};

const mockInitialEmptyData: User = {
  id: "thanka11",
  email: "",
  jobLookingStatus: undefined,
};

describe("LanguageInformationForm tests", () => {
  test("should render fields", () => {
    const onClick = jest.fn();
    renderMyStatusForm({
      initialData: mockInitialEmptyData,
      handleMyStatus: onClick,
    });
    expect(
      screen.getByRole("radio", {
        name: /Actively looking -/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", {
        name: /Open to opportunities - /i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", {
        name: /Inactive - I /i,
      }),
    ).toBeInTheDocument();
  });
  // test("Can't submit if no fields entered.", async () => {
  //   const mockSave = jest.fn();
  //   renderMyStatusForm({
  //     initialData: mockInitialEmptyData,
  //     handleMyStatus: mockSave,
  //   });

  //   fireEvent.submit(screen.getByText(/save/i));

  //   await waitFor(() => expect(mockSave).not.toHaveBeenCalled());
  // });
});
