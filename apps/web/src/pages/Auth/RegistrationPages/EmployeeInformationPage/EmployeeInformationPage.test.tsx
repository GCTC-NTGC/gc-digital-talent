import { act, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { GraphQLRequest } from "urql";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";
import { Kind } from "graphql";
import { vi } from "vitest";

import {
  expectNoAccessibilityErrors,
  renderWithProviders,
} from "@gc-digital-talent/vitest-helpers";

import type { EmployeeInformationFormProps } from "./EmployeeInformationPage";
import { EmployeeInformationForm } from "./EmployeeInformationPage";
import { getFakeWorkFieldOptionsResponse } from "./testUtils";

export const tryGetOperationName = (request: GraphQLRequest): string | null => {
  const definitions = request.query.definitions;
  const operationDefinition = definitions.find(
    (op) => op.kind == Kind.OPERATION_DEFINITION,
  );
  return operationDefinition?.name?.value ?? null;
};

const mockClient = {
  executeQuery: vi.fn((request: GraphQLRequest) => {
    const operationName = tryGetOperationName(request);
    switch (operationName) {
      case "WorkFieldOptions":
        return fromValue(getFakeWorkFieldOptionsResponse());
      default:
        return fromValue({});
    }
  }),
};

const renderEmployeeInformationForm = ({
  navigationTarget,
  onSubmit,
}: EmployeeInformationFormProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <EmployeeInformationForm
        navigationTarget={navigationTarget}
        onSubmit={onSubmit}
      />
    </GraphqlProvider>,
  );

describe("Create Account Form tests", () => {
  const user = userEvent.setup();

  const navigationTarget = "/en/applicant";

  it("should have no accessibility errors", async () => {
    const { container } = renderEmployeeInformationForm({
      navigationTarget,
      onSubmit: vi.fn(),
    });

    await act(async () => await expectNoAccessibilityErrors(container));
  });

  it("should render fields", () => {
    renderEmployeeInformationForm({
      navigationTarget,
      onSubmit: vi.fn(),
    });

    expect(
      screen.getByRole("textbox", {
        name: /job title/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", {
        name: /employment category/i,
      }),
    ).toBeInTheDocument();

    // Ensure conditional form elements don't exist yet.

    // first field for 'external' and 'government'
    expect(
      screen.queryByRole("textbox", {
        name: /organization/i,
      }),
    ).not.toBeInTheDocument();
    // first field for 'caf'
    expect(
      screen.queryByRole("group", {
        name: /employment type/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("should not submit with empty fields.", async () => {
    const mockSave = vi.fn();
    renderEmployeeInformationForm({
      navigationTarget,
      onSubmit: mockSave,
    });

    await user.click(
      screen.getByRole("button", { name: /save and continue/i }),
    );
    expect(mockSave).not.toHaveBeenCalled();
  });
});
