import { fireEvent, act, screen, waitFor } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";
import { vi } from "vitest";

import {
  axeTest,
  renderWithProviders,
} from "@gc-digital-talent/vitest-helpers";
import { Language, makeFragmentData } from "@gc-digital-talent/graphql";

import EmailVerification from "~/components/EmailVerification/EmailVerification";

import {
  GettingStartedForm,
  GettingStartedFormProps,
  GettingStartedInitialValues_Query,
  GettingStartedOptions_Query,
} from "./GettingStartedForm";

const mockSave = vi.fn().mockResolvedValue(undefined);

const mockClient = {
  executeQuery: vi.fn(() => pipe(fromValue({}), delay(0))),
  executeMutation: vi.fn(() =>
    fromValue({
      // pretend that an email address verification email was sent
      data: {
        sendUserEmailsVerification: {
          id: 1,
        },
      },
    }),
  ),
};

const mockInitialValuesData = makeFragmentData(
  {},
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
    const { container } = renderGettingStartedForm({
      initialValuesQuery: mockInitialValuesData,
      optionsQuery: mockOptionsData,
      onSubmit: mockSave,
    });

    await act(async () => {
      await axeTest(container);
    });
  });

  it("should render fields", async () => {
    renderGettingStartedForm({
      initialValuesQuery: mockInitialValuesData,
      optionsQuery: mockOptionsData,
      onSubmit: mockSave,
    });

    fireEvent.change(
      screen.getByRole("textbox", {
        name: /contact email address/i,
      }),
      { target: { value: "newuser@example.org" } },
    );
    fireEvent.click(
      screen.getByRole("button", { name: /send verification email/i }),
    );

    // mutation fires - wait for confirmation message
    await screen.findByText("Verification email sent!");

    expect(
      screen.getByRole("textbox", { name: /email verification code/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /first name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /last name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", { name: /preferred contact language/i }),
    ).toBeInTheDocument();
  });

  it("should submit successfully with required fields", async () => {
    renderGettingStartedForm({
      initialValuesQuery: mockInitialValuesData,
      optionsQuery: mockOptionsData,
      onSubmit: mockSave,
    });

    fireEvent.change(
      screen.getByRole("textbox", {
        name: /contact email address/i,
      }),
      { target: { value: "newuser@example.org" } },
    );
    fireEvent.click(
      screen.getByRole("button", { name: /send verification email/i }),
    );

    // mutation fires - wait for confirmation message
    await screen.findByText("Verification email sent!");

    fireEvent.change(
      screen.getByRole("textbox", {
        name: /email verification code/i,
      }),
      { target: { value: "AAAAAA" } },
    );

    fireEvent.change(
      screen.getByRole("textbox", {
        name: /first name/i,
      }),
      { target: { value: "FirstName" } },
    );

    fireEvent.change(
      screen.getByRole("textbox", {
        name: /last name/i,
      }),
      { target: { value: "LastName" } },
    );

    fireEvent.click(
      screen.getByRole("radio", {
        name: /english/i,
      }),
      { target: { value: "LastName" } },
    );

    fireEvent.submit(
      screen.getByRole("button", { name: /save and continue/i }),
    );
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });
});
