/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { AuthorizationContainer } from "@gc-digital-talent/auth";
import { EmailType } from "@gc-digital-talent/graphql";

import EmailVerificationApi, {
  EmailVerificationProps,
} from "./EmailVerification";

const getDefaultProps = (): EmailVerificationProps => ({
  emailType: EmailType.Contact,
  emailAddress: "example@example.org",
  onSkip: jest.fn(),
  onVerificationSuccess: jest.fn(),
});

const getMockClient = () => ({
  executeMutation: jest.fn(() => pipe(fromValue({}), delay(0))),
});

const renderComponent = (
  props: EmailVerificationProps,
  graphqlClient: {
    executeMutation: () => void;
  },
) =>
  renderWithProviders(
    <AuthorizationContainer
      roleAssignments={[]}
      userAuthInfo={{ id: "1234" }}
      isLoaded
    >
      <GraphqlProvider value={graphqlClient}>
        <EmailVerificationApi {...props} />
      </GraphqlProvider>
    </AuthorizationContainer>,
  );

describe("EmailVerification", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderComponent(getDefaultProps(), getMockClient());
    await waitFor(async () => {
      await axeTest(container);
    });
  });

  it("should not have a skip button if not handler provided", () => {
    renderComponent(
      {
        ...getDefaultProps(),
        onSkip: undefined,
      },
      getMockClient(),
    );
    const buttons = screen.queryAllByRole("button", {
      name: "Skip for now",
    });
    expect(buttons).toHaveLength(0);
  });

  it("should generate a skip event when clicked", () => {
    const handleSkip = jest.fn();
    renderComponent(
      {
        ...getDefaultProps(),
        onSkip: handleSkip,
      },
      getMockClient(),
    );
    const skipButton = screen.getByRole("button", {
      name: "Skip for now",
    });
    skipButton.click();
    expect(handleSkip.mock.calls).toHaveLength(1);
  });

  it("should make an API request to request a code on page load", () => {
    const mutation = jest.fn(() => pipe(fromValue({}), delay(0)));
    renderComponent(getDefaultProps(), {
      ...getMockClient(),
      executeMutation: mutation,
    });
    expect(mutation.mock.calls).toHaveLength(1);

    const callFirstArg = (mutation.mock.calls[0] as unknown[])[0];
    expect(callFirstArg).toHaveProperty(
      "query.definitions[0].name.value",
      "SendUserEmailVerification",
    );
  });

  it("should make an API request when a code is requested", () => {
    const mutation = jest.fn(() => pipe(fromValue({}), delay(0)));
    renderComponent(getDefaultProps(), {
      ...getMockClient(),
      executeMutation: mutation,
    });
    expect(mutation.mock.calls).toHaveLength(1);
    const requestButton = screen.getByRole("button", {
      name: "Send another one.",
    });
    act(() => {
      requestButton.click();
    });
    expect(mutation.mock.calls).toHaveLength(2);

    const callFirstArg = (mutation.mock.calls[1] as unknown[])[0];
    expect(callFirstArg).toHaveProperty(
      "query.definitions[0].name.value",
      "SendUserEmailVerification",
    );
  });

  it("should make an API request when a code is submitted", async () => {
    const mutation = jest.fn(() => pipe(fromValue({}), delay(0)));
    renderComponent(getDefaultProps(), {
      ...getMockClient(),
      executeMutation: mutation,
    });
    expect(mutation.mock.calls).toHaveLength(1);
    const codeInput = screen.getByRole("textbox", {
      name: /verification code/i,
    });

    await userEvent.type(codeInput, "123456");

    const submitButton = screen.getByRole("button", {
      name: "Submit",
    });
    await userEvent.click(submitButton);
    expect(mutation.mock.calls).toHaveLength(2);

    const callFirstArg = (mutation.mock.calls[1] as unknown[])[0];
    expect(callFirstArg).toHaveProperty("variables", {
      code: "123456",
      emailType: EmailType.Contact,
    });
    expect(callFirstArg).toHaveProperty(
      "query.definitions[0].name.value",
      "VerifyUserEmail",
    );
  });
});
