/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import { screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { AuthorizationContainer } from "@gc-digital-talent/auth";

import { DashboardPage } from "./CommunityDashboardPage";

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

describe("Render community dashboard page", () => {
  it("Correctly displays page for a community talent coordinator", () => {
    renderComponent("community_talent_coordinator");

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
      screen.queryByRole("link", {
        name: "Processes",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Talent requests",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Candidates",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Community talent",
      }),
    ).toBeInTheDocument();

    // resources links
    expect(
      screen.getByRole("link", {
        name: "Job advertisement templates",
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
        name: "Users",
      }),
    ).not.toBeInTheDocument();
  });
});
