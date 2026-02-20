import { screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";
import { vi } from "vitest";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";
import { AuthorizationContainer, ROLE_NAME } from "@gc-digital-talent/auth";

import { DashboardPage } from "./DepartmentDashboardPage";

const mockClient = {
  executeQuery: vi.fn(() => pipe(fromValue({}), delay(0))),
};

const renderComponent = (role: string) =>
  renderWithProviders(
    <AuthorizationContainer
      roleAssignments={[{ id: "123", role: { id: "123", name: role } }]}
      userAuthInfo={{ id: "123" }}
      isLoaded
    >
      <GraphqlProvider value={mockClient}>
        <DashboardPage />
      </GraphqlProvider>
    </AuthorizationContainer>,
  );

describe("Render department dashboard page", () => {
  it("Correctly displays page for a department admin", () => {
    renderComponent(ROLE_NAME.DepartmentAdmin);

    // card sections
    expect(
      screen.getByRole("heading", { name: /recruitment/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /resources/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /administration/i, level: 2 }),
    ).toBeInTheDocument();

    // recruitment links
    expect(
      screen.getByRole("link", {
        name: "Candidates",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Processes",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("link", {
        name: "Talent requests",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Community talent",
      }),
    ).not.toBeInTheDocument();

    // resources links
    expect(
      screen.getByRole("link", {
        name: "Job templates library",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Roles and permissions",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Skills library",
      }),
    ).toBeInTheDocument();

    // administration links
    expect(
      screen.getByRole("link", {
        name: "Users",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("link", {
        name: "Announcements",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Classifications",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Communities",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Departments",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Skill families",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Skills",
      }),
    ).not.toBeInTheDocument();
  });

  it("Correctly displays page for a department advisor", () => {
    renderComponent(ROLE_NAME.DepartmentHRAdvisor);

    // card sections
    expect(
      screen.getByRole("heading", { name: /recruitment/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /resources/i, level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /administration/i, level: 2 }),
    ).toBeInTheDocument();

    // recruitment links
    expect(
      screen.getByRole("link", {
        name: "Candidates",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Processes",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("link", {
        name: "Talent requests",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Community talent",
      }),
    ).not.toBeInTheDocument();

    // resources links
    expect(
      screen.getByRole("link", {
        name: "Job templates library",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Roles and permissions",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Skills library",
      }),
    ).toBeInTheDocument();

    // administration links
    expect(
      screen.getByRole("link", {
        name: "Users",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("link", {
        name: "Announcements",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Classifications",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Communities",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Departments",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Skill families",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Skills",
      }),
    ).not.toBeInTheDocument();
  });
});
