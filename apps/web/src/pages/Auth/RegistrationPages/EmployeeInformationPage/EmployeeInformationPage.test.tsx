/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider as GraphqlProvider, GraphQLRequest } from "urql";
import { fromValue } from "wonka";
import { Kind } from "graphql";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import {
  EmployeeInformationForm,
  EmployeeInformationFormProps,
} from "./EmployeeInformationPage";
import { getFakeWorkFieldOptionsResponse } from "./testUtils";

export const tryGetOperationName = (request: GraphQLRequest): string | null => {
  const definitions = request.query.definitions;
  const operationDefinition = definitions.find(
    (op) => op.kind == Kind.OPERATION_DEFINITION,
  );
  return operationDefinition?.name?.value ?? null;
};

const mockClient = {
  executeQuery: jest.fn((request: GraphQLRequest) => {
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
      onSubmit: jest.fn(),
    });

    await act(async () => await axeTest(container));
  });

  it("should render fields", () => {
    renderEmployeeInformationForm({
      navigationTarget,
      onSubmit: jest.fn(),
    });

    expect(
      screen.getByRole("textbox", {
        name: /my role/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", {
        name: /employment category/i,
      }),
    ).toBeInTheDocument();

    // Ensure conditional form elements don't exist yet.

    // first field for 'external'
    expect(
      screen.queryByRole("textbox", {
        name: /organization/i,
      }),
    ).not.toBeInTheDocument();
    // first field for 'government'
    expect(
      screen.queryByRole("combobox", {
        name: /department/i,
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
    const mockSave = jest.fn();
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
