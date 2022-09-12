/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { axeTest, render } from "@common/helpers/testUtils";
import {
  BilingualEvaluation,
  EvaluatedLanguageAbility,
  User,
} from "../../api/generated";
import {
  LanguageInformationForm,
  LanguageInformationUpdateHandler,
} from "./LanguageInformationForm";

const mockUser = { id: "testUserId" };

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

describe("LanguageInformationForm tests", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderLanguageInfoForm({
      initialData: mockUser,
      submitHandler: jest.fn(),
    });

    await axeTest(container);
  });

  test("Can't submit if no fields entered.", async () => {
    const mockSave = jest.fn();
    renderLanguageInfoForm({
      initialData: mockUser,
      submitHandler: mockSave,
    });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => expect(mockSave).not.toHaveBeenCalled());
  });
  test("Can't submit if only some required fields entered.", async () => {
    const mockSave = jest.fn();
    renderLanguageInfoForm({
      initialData: mockUser,
      submitHandler: mockSave,
    });

    const bilingualCheckbox = screen.getByLabelText(
      "Bilingual positions (English and French)",
    );
    fireEvent.click(bilingualCheckbox);
    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => expect(mockSave).not.toHaveBeenCalled());
  });
  test("Extra fields appear after selecting bilingual.", async () => {
    const mockSave = jest.fn();
    renderLanguageInfoForm({
      initialData: mockUser,
      submitHandler: mockSave,
    });

    const bilingualEvaluationSection = screen.queryByText(
      "Bilingual evaluation",
    );
    expect(bilingualEvaluationSection).toBeNull();

    const bilingualCheckbox = screen.getByLabelText(
      "Bilingual positions (English and French)",
    );
    fireEvent.click(bilingualCheckbox);

    await waitFor(() => {
      expect(
        screen.getByText("Bilingual evaluation", {
          ignore: "script, style, legend",
        }),
      ).toBeInTheDocument();
    });
  });
  test("If not bilingual extra fields are not required.", async () => {
    const mockSave = jest.fn((data) => Promise.resolve(data));
    renderLanguageInfoForm({
      initialData: mockUser,
      submitHandler: mockSave,
    });

    const englishCheckbox = screen.getByLabelText("English positions");
    fireEvent.click(englishCheckbox);
    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => expect(mockSave).toHaveBeenCalledTimes(1));
  });
  test("Form submits data in correct shape", async () => {
    const mockSave = jest.fn((data) => Promise.resolve(data));
    const user = {
      id: "testUserId",
      bilingualEvaluation: BilingualEvaluation.CompletedFrench,
      comprehensionLevel: EvaluatedLanguageAbility.A,
      writtenLevel: EvaluatedLanguageAbility.P,
      verbalLevel: EvaluatedLanguageAbility.E,
      lookingForEnglish: true,
      lookingForFrench: false,
      lookingForBilingual: true,
    };

    renderLanguageInfoForm({
      initialData: user,
      submitHandler: mockSave,
    });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() =>
      expect(mockSave).toHaveBeenCalledWith(user.id, {
        bilingualEvaluation: BilingualEvaluation.CompletedFrench,
        comprehensionLevel: EvaluatedLanguageAbility.A,
        writtenLevel: EvaluatedLanguageAbility.P,
        verbalLevel: EvaluatedLanguageAbility.E,
        lookingForEnglish: true,
        lookingForFrench: false,
        lookingForBilingual: true,
        estimatedLanguageAbility: null,
      }),
    );
  });
});
