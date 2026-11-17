import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

import Toolbar from "./Toolbar";

const renderToolbar = () =>
  renderWithProviders(
    <Toolbar.Root aria-label="Bulk actions">
      <Toolbar.Button>One</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button>Two</Toolbar.Button>
      <Toolbar.Button>Three</Toolbar.Button>
    </Toolbar.Root>,
  );

describe("Toolbar", () => {
  const user = userEvent.setup();

  it("should have no accessibility errors", async () => {
    const { container } = renderToolbar();
    await expectNoAccessibilityErrors(container);
  });

  it("should render a labelled toolbar", () => {
    renderToolbar();

    expect(
      screen.getByRole("toolbar", { name: /bulk actions/i }),
    ).toBeInTheDocument();
  });

  it("should be a single tab stop navigated with arrow keys", async () => {
    renderToolbar();

    await user.tab();
    expect(screen.getByRole("button", { name: /one/i })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: /two/i })).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: /three/i })).toHaveFocus();

    await user.tab();
    expect(document.body).toHaveFocus();
  });
});
