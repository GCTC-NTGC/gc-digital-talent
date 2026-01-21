import { screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";
import { vi } from "vitest";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";
import { AuthorizationContainer } from "@gc-digital-talent/auth";

import { DashboardPage } from "./AdminDashboardPage";

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

describe("Render dashboard page", () => {
  it("Correctly displays page for platform admins", () => {
    renderComponent("platform_admin");

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
        name: "Processes",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Candidates",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Talent requests",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Community talent",
      }),
    ).toBeInTheDocument();

    // resources links
    expect(
      screen.getByRole("link", {
        name: "Job templates library",
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
        name: "Announcements",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Classifications",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Communities",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Departments",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Job templates",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Skill families",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Skills",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Users",
      }),
    ).toBeInTheDocument();
  });

  it("Correctly displays page for community admins", () => {
    renderComponent("community_admin");

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
        name: "Processes",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Talent requests",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Candidates",
      }),
    ).toBeInTheDocument();

    // resources links
    expect(
      screen.getByRole("link", {
        name: "Job templates library",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Skills library",
      }),
    ).toBeInTheDocument();

    // administration links
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
      screen.getByRole("link", {
        name: "Communities",
      }),
    ).toBeInTheDocument();
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
    expect(
      screen.getByRole("link", {
        name: "Users",
      }),
    ).toBeInTheDocument();
  });

  it("Correctly displays page for process operators", () => {
    renderComponent("process_operator");

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
        name: "Processes",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Candidates",
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
        name: "Skills library",
      }),
    ).toBeInTheDocument();

    // administration links
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
    expect(
      screen.getByRole("link", {
        name: "Users",
      }),
    ).toBeInTheDocument();
  });

  it("Correctly displays page for community recruiters", () => {
    renderComponent("community_recruiter");

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
        name: "Processes",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Talent requests",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Candidates",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Community talent",
      }),
    ).toBeInTheDocument();

    // resources links
    expect(
      screen.getByRole("link", {
        name: "Job templates library",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Skills library",
      }),
    ).toBeInTheDocument();

    // administration links
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
      screen.getByRole("link", {
        name: "Communities",
      }),
    ).toBeInTheDocument();
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
    expect(
      screen.getByRole("link", {
        name: "Users",
      }),
    ).toBeInTheDocument();
  });
});
