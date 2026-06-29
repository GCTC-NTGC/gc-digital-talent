import { screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import EmployeeVerificationSection, {
  UserEmployeeVerification_Fragment,
  type EmployeeVerificationSectionProps,
} from "./EmployeeVerificationSection";

const defaultUser = {
  isVerifiedGovEmployee: true,
  workEmail: "fake@domain.com",
  isWorkEmailVerified: true,
};

const userQuery = makeFragmentData(
  defaultUser,
  UserEmployeeVerification_Fragment,
);

const render = (props: EmployeeVerificationSectionProps) =>
  renderWithProviders(
    <GraphqlProvider value={{}}>
      <EmployeeVerificationSection {...props} />
    </GraphqlProvider>,
  );

describe("EmployeeVerificationSection", () => {
  it("Renders actions in applicant context", () => {
    render({
      userQuery,
      context: "applicant",
    });

    expect(
      screen.getByRole("button", { name: /update work email/i }),
    ).toBeInTheDocument();
  });

  it("Does not render actions in applicant context", () => {
    render({
      userQuery,
      context: "admin",
    });

    expect(
      screen.queryByRole("button", { name: /update work email/i }),
    ).not.toBeInTheDocument();
  });
});
