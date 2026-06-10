import { screen } from "@testing-library/react";

import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

import IAPHomePage from "./Home";

const renderHome = () => renderWithProviders(<IAPHomePage />);

describe("Basic test for Home", () => {
  it("should render", () => {
    renderHome();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "IT Apprenticeship Program for Indigenous Peoples",
      }),
    ).toBeInTheDocument();
  });

  it("should have no accessibility errors", async () => {
    const { container } = renderHome();

    await expectNoAccessibilityErrors(container);
  });
});
