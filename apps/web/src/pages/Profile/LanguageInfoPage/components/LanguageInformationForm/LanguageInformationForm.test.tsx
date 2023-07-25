/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, act } from "@testing-library/react";
import React from "react";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { fakeUsers } from "@gc-digital-talent/fake-data";
import {
  BilingualEvaluation,
  EvaluatedLanguageAbility,
  User,
} from "~/api/generated";
import LanguageInformationForm, {
  LanguageInformationUpdateHandler,
} from "./LanguageInformationForm";

const mockUser = {
  ...fakeUsers()[0],
  id: "testUserId",
};

const inCompleteUser = {
  ...mockUser,
  lookingForBilingual: true,
  bilingualEvaluation: undefined,
};

const bilingualUser = {
  id: mockUser.id,
  bilingualEvaluation: BilingualEvaluation.CompletedFrench,
  comprehensionLevel: EvaluatedLanguageAbility.A,
  writtenLevel: EvaluatedLanguageAbility.P,
  verbalLevel: EvaluatedLanguageAbility.E,
  lookingForEnglish: true,
  lookingForFrench: false,
  lookingForBilingual: true,
};

const renderLanguageInfoForm = ({
  initialData,
  submitHandler,
}: {
  initialData: User;
  submitHandler: LanguageInformationUpdateHandler;
}) =>
  renderWithProviders(
    <LanguageInformationForm
      initialData={initialData}
      submitHandler={submitHandler}
    />,
  );

describe("LanguageInformationForm", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("should have no accessibility errors", async () => {
    const { container } = renderLanguageInfoForm({
      initialData: mockUser,
      submitHandler: jest.fn(),
    });
    await axeTest(container);
  });

  it("Can't submit if no fields entered.", async () => {
    const mockSave = jest.fn();
    renderLanguageInfoForm({
      initialData: mockUser,
      submitHandler: mockSave,
    });
    await act(async () => {
      screen.getByText(/save/i).click();
    });
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("Can't submit if only some required fields entered.", async () => {
    const mockSave = jest.fn();
    renderLanguageInfoForm({
      initialData: inCompleteUser,
      submitHandler: mockSave,
    });
    await act(async () => {
      screen.getByLabelText("Bilingual positions (English and French)").click();
      screen.getByRole("button", { name: /save/i }).click();
    });
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("Extra fields appear after selecting bilingual.", async () => {
    const mockSave = jest.fn();
    renderLanguageInfoForm({
      initialData: mockUser,
      submitHandler: mockSave,
    });
    expect(await screen.queryByText("Bilingual evaluation")).toBeNull();
    await act(async () => {
      screen
        .getByRole("checkbox", {
          name: /bilingual/i,
        })
        .click();
    });
    expect(
      await screen.findByRole("group", { name: /bilingual evaluation/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("group", {
        name: /second language proficiency/i,
      }),
    ).toBeInTheDocument();
  });

  it("should submit when bilingual fields are not required.", async () => {
    const mockSave = jest.fn((data) => Promise.resolve(data));
    renderLanguageInfoForm({
      initialData: mockUser,
      submitHandler: mockSave,
    });
    await act(async () => {
      screen.getByRole("checkbox", { name: /english positions/i }).click();
      screen.getByRole("button", { name: /save/i }).click();
    });
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it("should submit data in correct shape", async () => {
    const mockSave = jest.fn((data) => Promise.resolve(data));

    renderLanguageInfoForm({
      initialData: bilingualUser,
      submitHandler: mockSave,
    });
    await act(async () => {
      screen.getByRole("button", { name: /save/i }).click();
    });

    expect(mockSave).toHaveBeenCalledWith(bilingualUser.id, {
      bilingualEvaluation: BilingualEvaluation.CompletedFrench,
      comprehensionLevel: EvaluatedLanguageAbility.A,
      writtenLevel: EvaluatedLanguageAbility.P,
      verbalLevel: EvaluatedLanguageAbility.E,
      lookingForEnglish: true,
      lookingForFrench: false,
      lookingForBilingual: true,
      estimatedLanguageAbility: null,
    });
  });
});
