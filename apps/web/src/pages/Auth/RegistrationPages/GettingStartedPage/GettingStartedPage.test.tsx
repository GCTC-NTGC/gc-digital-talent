/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { Language, makeFragmentData } from "@gc-digital-talent/graphql";

import EmailVerification from "~/components/EmailVerification/EmailVerification";

import {
  GettingStartedForm,
  GettingStartedFormProps,
  GettingStartedInitialValues_Query,
  GettingStartedOptions_Query,
} from "./GettingStartedForm";

const mockSave = jest.fn();

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
};

const mockInitialValuesData = makeFragmentData(
  {
    email: "example@example.org",
  },
  GettingStartedInitialValues_Query,
);

const mockOptionsData = makeFragmentData(
  {
    languages: [
      {
        value: Language.En,
        label: {
          en: "English",
          fr: "",
        },
      },
      {
        value: Language.Fr,
        label: {
          en: "French",
          fr: "",
        },
      },
    ],
  },
  GettingStartedOptions_Query,
);

const renderGettingStartedForm = ({
  initialValuesQuery,
  optionsQuery,
  onSubmit,
}: GettingStartedFormProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <EmailVerification.Provider>
        <GettingStartedForm
          initialValuesQuery={initialValuesQuery}
          optionsQuery={optionsQuery}
          onSubmit={onSubmit}
        />
      </EmailVerification.Provider>
    </GraphqlProvider>,
  );

describe("Getting Started Form tests", () => {
  it("should have no accessibility errors", async () => {
    // Triggers the error `An update to Submit inside a test was not wrapped in act(...).`
    // Switching the Submit components to Buttons in these files fixes it:
    //  - apps/web/src/pages/Auth/RegistrationPages/GettingStartedPage/GettingStartedForm.tsx
    //  - apps/web/src/components/EmailVerification/RequestVerificationCodeForm.tsx
    const { container } = renderGettingStartedForm({
      initialValuesQuery: mockInitialValuesData,
      optionsQuery: mockOptionsData,
      onSubmit: mockSave,
    });

    await axeTest(container);
  });
});
