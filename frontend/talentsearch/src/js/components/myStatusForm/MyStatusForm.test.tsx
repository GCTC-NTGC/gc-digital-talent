/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import {
  GetMyStatusQuery,
  WorkRegion,
  JobLookingStatus,
  Language,
  ProvinceOrTerritory,
  SalaryRange,
} from "../../api/generated";
import { render, screen, fireEvent, waitFor } from "../../tests/testUtils";
import { MyStatusForm, MyStatusFormProps } from "./MyStatusForm";

const renderMyStatusForm = ({
  initialData,
  handleMyStatus,
}: MyStatusFormProps) => {
  return render(
    <MyStatusForm initialData={initialData} handleMyStatus={handleMyStatus} />,
  );
};

const mockDataForIncompleteForm: GetMyStatusQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "11",
    jobLookingStatus: JobLookingStatus.ActivelyLooking,
    firstName: "Shubi",
    lastName: "Suresh",
    email: "fff@gmaik.com",
    telephone: "12345679000",
    preferredLang: Language.En,
    currentProvince: ProvinceOrTerritory.Alberta,
    currentCity: "fgrtyuii",
    lookingForEnglish: true,
    lookingForFrench: true,
    lookingForBilingual: true,
    isGovEmployee: undefined,
    locationPreferences: [WorkRegion.Atlantic],
    wouldAcceptTemporary: false,
    expectedSalary: [SalaryRange["50_59K"]],
  },
};
const mockDataForCompleteForm: GetMyStatusQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "11",
    jobLookingStatus: JobLookingStatus.ActivelyLooking,
    firstName: "Shubi",
    lastName: "Suresh",
    email: "fff@gmaik.com",
    telephone: "12345679000",
    preferredLang: Language.En,
    currentProvince: ProvinceOrTerritory.Alberta,
    currentCity: "fgrtyuii",
    lookingForEnglish: true,
    lookingForFrench: true,
    lookingForBilingual: true,
    isGovEmployee: true,
    locationPreferences: [WorkRegion.Atlantic],
    wouldAcceptTemporary: false,
    expectedSalary: [SalaryRange["50_59K"]],
  },
};
const mockEmptyData: GetMyStatusQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "11",
    jobLookingStatus: undefined,
    firstName: undefined,
    lastName: undefined,
    email: "",
    telephone: undefined,
    preferredLang: undefined,
    currentProvince: undefined,
    currentCity: undefined,
    lookingForEnglish: undefined,
    lookingForFrench: undefined,
    lookingForBilingual: undefined,
    isGovEmployee: undefined,
    locationPreferences: undefined,
    wouldAcceptTemporary: undefined,
    expectedSalary: undefined,
  },
};
describe("LanguageInformationForm tests", () => {
  test("Should render fields", () => {
    const onClick = jest.fn();
    renderMyStatusForm({
      initialData: mockEmptyData,
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
  test("If application not complete, inputs disabled and Why can I change my status appears", () => {
    const onClick = jest.fn();
    renderMyStatusForm({
      initialData: mockDataForIncompleteForm,
      handleMyStatus: onClick,
    });
    expect(
      screen.getByRole("radio", {
        name: /Actively looking -/i,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("radio", {
        name: /Open to opportunities - /i,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("radio", {
        name: /Inactive - I /i,
      }),
    ).toBeDisabled();
    expect(
      screen.getByText(`Why can’t I change my status?`),
    ).toBeInTheDocument();
  });
  test("If application complete, inputs enabled and Why can I change my status hidden", () => {
    const onClick = jest.fn();
    renderMyStatusForm({
      initialData: mockDataForCompleteForm,
      handleMyStatus: onClick,
    });
    expect(
      screen.getByRole("radio", {
        name: /Actively looking -/i,
      }),
    ).toBeEnabled();
    expect(
      screen.getByRole("radio", {
        name: /Open to opportunities - /i,
      }),
    ).toBeEnabled();
    expect(
      screen.getByRole("radio", {
        name: /Inactive - I /i,
      }),
    ).toBeEnabled();
    expect(
      screen.queryByText(`Why can’t I change my status?`),
    ).not.toBeInTheDocument();
  });
  test("Submit handler called whenever radio selection changes", async () => {
    const OnClick = jest.fn();
    renderMyStatusForm({
      initialData: mockEmptyData,
      handleMyStatus: OnClick,
    });

    fireEvent.click(
      screen.getByRole("radio", {
        name: /Actively looking -/i,
      }),
    );
    await waitFor(() => expect(OnClick).toHaveBeenCalled());
    fireEvent.click(
      screen.getByRole("radio", {
        name: /Open to opportunities - /i,
      }),
    );
    await waitFor(() => expect(OnClick).toHaveBeenCalled());
    fireEvent.click(
      screen.getByRole("radio", {
        name: /Inactive - I /i,
      }),
    );
    await waitFor(() => expect(OnClick).toHaveBeenCalled());
  });
});
