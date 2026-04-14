import { fireEvent, act, screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";
import { vi } from "vitest";

import {
  expectNoAccessibilityErrors,
  renderWithProviders,
} from "@gc-digital-talent/vitest-helpers";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import EmailVerification from "~/components/EmailVerification/EmailVerification";

import type { GettingStartedFormProps } from "./GettingStartedForm";
import GettingStartedForm, {
  GettingStartedInitialValues_Query,
} from "./GettingStartedForm";

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

const mockDataNoWorkEmail = makeFragmentData(
  {
    firstName: "First",
    lastName: "Last",
    preferredLang: {
      label: {
        localized: "Language",
      },
    },
    email: "example@example.org",
    workEmail: null,
    isWorkEmailVerified: null,
    telephone: "1234567890",
  },
  GettingStartedInitialValues_Query,
);

const mockDataWithWorkEmail = makeFragmentData(
  {
    firstName: "First",
    lastName: "Last",
    preferredLang: {
      label: {
        localized: "Language",
      },
    },
    email: "example@example.org",
    workEmail: "example@gc.ca",
    isWorkEmailVerified: true,
    telephone: "1234567890",
  },
  GettingStartedInitialValues_Query,
);

const renderGettingStartedForm = ({
  initialValuesQuery,
}: GettingStartedFormProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <EmailVerification.Provider>
        <GettingStartedForm initialValuesQuery={initialValuesQuery} />
      </EmailVerification.Provider>
    </GraphqlProvider>,
  );

describe("Getting Started Form tests", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderGettingStartedForm({
      initialValuesQuery: mockDataNoWorkEmail,
    });

    await act(async () => {
      await expectNoAccessibilityErrors(container);
    });
  });

  it("can verify separate work email", async () => {
    renderGettingStartedForm({
      initialValuesQuery: mockDataNoWorkEmail,
    });

    fireEvent.click(
      screen.getByRole("radio", {
        name: /I currently work for the Government of Canada/i,
      }),
    );

    // wait for the bottom half to change
    await screen.findByRole("textbox", { name: /government work email/i });

    fireEvent.change(
      screen.getByRole("textbox", {
        name: /government work email/i,
      }),
      { target: { value: "example@gc.ca" } },
    );
    fireEvent.click(
      screen.getByRole("button", { name: /send verification email/i }),
    );

    // mutation fires - wait for confirmation message
    expect(
      await screen.findByText("Verification email sent!"),
    ).toBeInTheDocument();
  });

  it("can recognize an already set work email", async () => {
    renderGettingStartedForm({
      initialValuesQuery: mockDataWithWorkEmail,
    });

    expect(
      await screen.findByText(
        "The email provided by CanadaLogin is a verified work email",
      ),
    ).toBeInTheDocument();
  });
});
