/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import { screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { AuthorizationContainer } from "@gc-digital-talent/auth";

import { DashboardPage } from "./AdminDashboardPage";

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
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
    expect(screen.getByText(/recruitment/i)).toBeInTheDocument();
    expect(screen.getByText(/resources/i)).toBeInTheDocument();
    expect(screen.getByText(/administration/i)).toBeInTheDocument();

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
        name: "Teams",
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
    expect(screen.getByText(/recruitment/i)).toBeInTheDocument();
    expect(screen.getByText(/resources/i)).toBeInTheDocument();
    expect(screen.getByText(/administration/i)).toBeInTheDocument();

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
      screen.queryByRole("link", {
        name: "Candidates",
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
      screen.queryByRole("link", {
        name: "Teams",
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
    expect(screen.getByText(/recruitment/i)).toBeInTheDocument();
    expect(screen.getByText(/resources/i)).toBeInTheDocument();
    expect(screen.getByText(/administration/i)).toBeInTheDocument();

    // recruitment links
    expect(
      screen.getByRole("link", {
        name: "Processes",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Candidates",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Talent requests",
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
      screen.queryByRole("link", {
        name: "Teams",
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
    expect(screen.getByText(/recruitment/i)).toBeInTheDocument();
    expect(screen.getByText(/resources/i)).toBeInTheDocument();
    expect(screen.getByText(/administration/i)).toBeInTheDocument();

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
      screen.queryByRole("link", {
        name: "Candidates",
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
      screen.queryByRole("link", {
        name: "Teams",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Users",
      }),
    ).toBeInTheDocument();
  });
});
