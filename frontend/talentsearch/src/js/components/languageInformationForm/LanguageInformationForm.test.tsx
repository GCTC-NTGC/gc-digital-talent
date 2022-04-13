/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import {
  BilingualEvaluation,
  EvaluatedLanguageAbility,
} from "../../api/generated";
import {
  LanguageInformationForm,
  LanguageInformationFormProps,
} from "./LanguageInformationForm";

const renderWithReactIntl = (
  component: React.ReactNode,
  locale?: "en" | "fr",
  messages?: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  return render(
    <IntlProvider locale={locale || "en"} messages={messages}>
      {component}
    </IntlProvider>,
  );
};

const mockUser = { me: { id: "testUserId" } };

const renderLanguageInfoForm = ({
  initialData,
  onUpdateLanguageInformation,
}: LanguageInformationFormProps) => (
  <>
    {renderWithReactIntl(
      <LanguageInformationForm
        initialData={initialData}
        onUpdateLanguageInformation={onUpdateLanguageInformation}
      />,
    )}
  </>
);

describe("LanguageInformationForm tests", () => {
  test("Can't submit if no fields entered.", async () => {
    const mockSave = jest.fn();
    renderLanguageInfoForm({
      initialData: mockUser,
      onUpdateLanguageInformation: mockSave,
    });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => expect(mockSave).not.toHaveBeenCalled());
  });
  test("Can't submit if only some required fields entered.", async () => {
    const mockSave = jest.fn();
    renderLanguageInfoForm({
      initialData: mockUser,
      onUpdateLanguageInformation: mockSave,
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
      onUpdateLanguageInformation: mockSave,
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
    const mockSave = jest.fn();
    renderLanguageInfoForm({
      initialData: mockUser,
      onUpdateLanguageInformation: mockSave,
    });

    const englishCheckbox = screen.getByLabelText("English positions");
    fireEvent.click(englishCheckbox);
    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => expect(mockSave).toHaveBeenCalledTimes(1));
  });
  test("Form submits data in correct shape", async () => {
    const mockSave = jest.fn();
    const user = {
      me: {
        id: "testUserId",
        bilingualEvaluation: BilingualEvaluation.NotCompleted,
        comprehensionLevel: EvaluatedLanguageAbility.A,
        writtenLevel: EvaluatedLanguageAbility.P,
        verbalLevel: EvaluatedLanguageAbility.E,
        lookingForEnglish: false,
        lookingForFrench: true,
        lookingForBilingual: true,
      },
    };

    renderLanguageInfoForm({
      initialData: user,
      onUpdateLanguageInformation: mockSave,
    });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() =>
      expect(mockSave).toHaveBeenCalledWith("testUserId", {
        bilingualEvaluation: BilingualEvaluation.NotCompleted,
        comprehensionLevel: EvaluatedLanguageAbility.A,
        writtenLevel: EvaluatedLanguageAbility.P,
        verbalLevel: EvaluatedLanguageAbility.E,
        lookingForEnglish: false,
        lookingForFrench: true,
        lookingForBilingual: true,
        estimatedLanguageAbility: null,
      }),
    );
  });
});
