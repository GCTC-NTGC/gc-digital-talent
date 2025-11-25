import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";

import Notice, { NoticeProps } from "./Notice";

function renderNotice(props: NoticeProps) {
  return renderWithProviders(<Notice.Root {...props} />);
}

describe("Notice", () => {
  const user = userEvent.setup();

  it("Should have dismiss action", async () => {
    const dismissHandler = vi.fn();
    renderNotice({ onDismiss: dismissHandler });

    const dismissBtn = screen.getByRole("button", { name: /close alert/i });
    expect(dismissBtn).toBeVisible();

    await user.click(dismissBtn);

    expect(dismissHandler).toHaveBeenCalledTimes(1);
  });
});
