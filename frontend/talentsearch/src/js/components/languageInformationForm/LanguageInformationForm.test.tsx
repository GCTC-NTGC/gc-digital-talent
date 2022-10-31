/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { axeTest, render } from "@common/helpers/testUtils";
import { act } from "react-dom/test-utils";
import { fakeUsers } from "@common/fakeData";
import {
  BilingualEvaluation,
  EvaluatedLanguageAbility,
  User,
} from "../../api/generated";
import {
  LanguageInformationForm,
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
  render(
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
    await act(async () => {
      renderLanguageInfoForm({
        initialData: mockUser,
        submitHandler: mockSave,
      });
    });
    fireEvent.submit(screen.getByText(/save/i));
    await waitFor(() => expect(mockSave).not.toHaveBeenCalled());
  });
  it("Can't submit if only some required fields entered.", async () => {
    const mockSave = jest.fn();
    await act(async () => {
      renderLanguageInfoForm({
        initialData: inCompleteUser,
        submitHandler: mockSave,
      });
    });
    fireEvent.click(
      await screen.getByLabelText("Bilingual positions (English and French)"),
    );
    fireEvent.submit(await screen.getByRole("button", { name: /save/i }));
    await waitFor(() => expect(mockSave).not.toHaveBeenCalled());
  });
  it("Extra fields appear after selecting bilingual.", async () => {
    const mockSave = jest.fn();
    await act(async () => {
      renderLanguageInfoForm({
        initialData: mockUser,
        submitHandler: mockSave,
      });
    });
    expect(await screen.queryByText("Bilingual evaluation")).toBeNull();
    const checkbox = await screen.getByRole("checkbox", {
      name: /bilingual/i,
    });
    fireEvent.click(checkbox);
    await waitFor(async () => {
      expect(await screen.findAllByText(/bilingual evaluation/i)).toHaveLength(
        2,
      );
    });
  });
  it("should submit when bilingual fields are not required.", async () => {
    const mockSave = jest.fn((data) => Promise.resolve(data));
    await act(async () => {
      renderLanguageInfoForm({
        initialData: mockUser,
        submitHandler: mockSave,
      });
    });
    fireEvent.click(
      await screen.getByRole("checkbox", { name: /english positions/i }),
    );
    fireEvent.submit(await screen.getByRole("button", { name: /save/i }));
    await waitFor(() => expect(mockSave).toHaveBeenCalledTimes(1));
  });
  it("should submit data in correct shape", async () => {
    const mockSave = jest.fn((data) => Promise.resolve(data));

    renderLanguageInfoForm({
      initialData: bilingualUser,
      submitHandler: mockSave,
    });
    fireEvent.submit(await screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
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
});
