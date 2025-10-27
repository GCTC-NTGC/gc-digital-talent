import { screen } from "@testing-library/react";

import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

import { Home } from "./Home";

const renderHome = () => renderWithProviders(<Home />);

describe("Basic test for Home", () => {
  it("should render", () => {
    renderHome();
    expect(
      screen.getByRole("h1", {
        name: "IT Apprenticeship Program for Indigenous Peoples",
      }),
    ).toBeInTheDocument();
  });

  it("should have no accessibility errors", async () => {
    const { container } = renderHome();

    await expectNoAccessibilityErrors(container);
  });
});
