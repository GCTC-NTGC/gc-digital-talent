/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";

import { EditPoolForm, EditPoolFormProps } from "./EditPoolPage";
import EditPoolStory, { DraftPool } from "./EditPoolPage.stories";

jest.setTimeout(500 * 1000);

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
};

describe("EditPoolPage", () => {
  const user = userEvent.setup();

  it("should have save buttons that emit a save event when the status is draft", async () => {
    const handleSave = jest.fn(() => Promise.resolve());
    const props = {
      ...EditPoolStory.args,
      ...DraftPool.args,
      onSave: handleSave,
    } as EditPoolFormProps;

    renderWithProviders(
      <GraphqlProvider value={mockClient}>
        <EditPoolForm {...props} />
      </GraphqlProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: /edit advertisement details/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /save advertisement details/i }),
    );

    await user.click(
      screen.getByRole("button", { name: /edit closing date/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /save closing date/i }),
    );

    await user.click(screen.getByRole("button", { name: /edit your impact/i }));
    await user.click(
      screen.getByRole("button", { name: /save introduction/i }),
    );

    await user.click(screen.getByRole("button", { name: /edit work tasks/i }));
    await user.click(screen.getByRole("button", { name: /save work tasks/i }));

    await user.click(
      screen.getByRole("button", { name: /edit core requirements/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /save core requirements/i }),
    );

    await user.click(
      screen.getByRole("button", { name: /edit special note/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /save special note/i }),
    );

    await user.click(
      screen.getByRole("button", {
        name: /edit what to expect post-application/i,
      }),
    );
    await user.click(
      screen.getByRole("button", {
        name: /save what to expect/i,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: /edit what to expect post-admission/i,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: /save what to expect/i,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: /edit about us/i,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: /save about us/i,
      }),
    );

    expect(handleSave).toHaveBeenCalledTimes(9);
  });
});
