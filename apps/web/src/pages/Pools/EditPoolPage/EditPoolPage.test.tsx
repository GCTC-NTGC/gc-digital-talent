/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  renderWithProviders,
  updateDate,
} from "@gc-digital-talent/jest-helpers";

import { EditPoolForm, EditPoolFormProps } from "./EditPoolPage";
import EditPoolStory, {
  DraftPool,
  PublishedPool,
  ExpiredPool,
} from "./EditPoolPage.stories";

jest.setTimeout(500 * 1000);

describe("Edit Pool tests", () => {
  const user = userEvent.setup();

  it("should have save buttons that emit a save event when the status is draft", async () => {
    const handleSave = jest.fn();
    const props = {
      ...EditPoolStory.args,
      ...DraftPool.args,
      onSave: handleSave,
    } as EditPoolFormProps;

    renderWithProviders(<EditPoolForm {...props} />);

    await user.click(screen.getByRole("button", { name: /save pool name/i }));

    await user.click(
      screen.getByRole("button", { name: /save closing date/i }),
    );

    await user.click(
      screen.getByRole("button", { name: /save introduction/i }),
    );

    await user.click(screen.getByRole("button", { name: /save work tasks/i }));

    await user.click(
      screen.getByRole("button", { name: /save essential skills/i }),
    );

    await user.click(
      screen.getByRole("button", { name: /save asset skills/i }),
    );

    await user.click(
      screen.getByRole("button", { name: /save other requirements/i }),
    );

    expect(handleSave).toHaveBeenCalledTimes(7);
  });

  it("should have a publish button that pops a modal and emits an event when the status is draft", async () => {
    const handleEvent = jest.fn();
    const props = {
      ...EditPoolStory.args,
      ...DraftPool.args,
      onPublish: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    renderWithProviders(<DraftPool {...props} />);

    await user.click(screen.getByRole("button", { name: /publish/i }));

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await user.click(
      within(dialog).getByRole("button", { name: /publish pool/i }),
    );

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should have a delete button that pops a modal and emits an event when the status is draft", async () => {
    const handleEvent = jest.fn();

    const props = {
      ...EditPoolStory.args,
      ...DraftPool.args,
      onPublish: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    renderWithProviders(<DraftPool {...props} />);

    await user.click(screen.getByRole("button", { name: /publish/i }));

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await user.click(
      within(dialog).getByRole("button", { name: /publish pool/i }),
    );

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should have a delete button that pops a modal and emits an event when the status is draft", async () => {
    const handleEvent = jest.fn();

    const props = {
      ...EditPoolStory.args,
      ...DraftPool.args,
      onDelete: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    renderWithProviders(<DraftPool {...props} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await user.click(within(dialog).getByRole("button", { name: /delete/i }));

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should not have buttons for close, extend, archive when the status is draft", async () => {
    const props = {
      ...EditPoolStory.args,
      ...DraftPool.args,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      renderWithProviders(<DraftPool {...props} />);
    });

    expect(
      screen.queryByRole("button", { name: /close/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /extend the date/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /archive/i }),
    ).not.toBeInTheDocument();
  });

  it("should have a close button that pops a modal and emits an event when the status is published", async () => {
    const handleEvent = jest.fn();
    const props = {
      ...EditPoolStory.args,
      ...PublishedPool.args,
      onClose: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    renderWithProviders(<PublishedPool {...props} />);

    await user.click(screen.getByRole("button", { name: /close/i }));

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await user.click(
      within(dialog).getByRole("button", { name: /close pool now/i }),
    );

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should have an extend button that pops a modal and emits an event when the status is published", async () => {
    const handleEvent = jest.fn(() => Promise.resolve());
    const props = {
      ...EditPoolStory.args,
      ...PublishedPool.args,
      onExtend: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    renderWithProviders(<PublishedPool {...props} />);

    await user.click(screen.getByRole("button", { name: /extend the date/i }));

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await user.click(
      within(dialog).getByRole("button", { name: /extend closing date/i }),
    );

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should not have buttons for publish, delete, archive when the status is published", async () => {
    const props = {
      ...EditPoolStory.args,
      ...PublishedPool.args,
    } as EditPoolFormProps;

    renderWithProviders(<PublishedPool {...props} />);

    expect(
      screen.queryByRole("button", { name: /publish/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /archive/i }),
    ).not.toBeInTheDocument();
  });

  it("should have an extend button that pops a modal and emits an event when the status is expired", async () => {
    const handleEvent = jest.fn(() => Promise.resolve());
    const props = {
      ...EditPoolStory.args,
      ...ExpiredPool.args,
      onExtend: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    renderWithProviders(<PublishedPool {...props} />);

    await user.click(screen.getByRole("button", { name: /extend the date/i }));

    // find the modal
    const dialog = screen.getByRole("dialog", {
      name: /extend closing date/i,
    });

    // interact with the modal
    const dateInput = within(dialog).getByRole("group", {
      name: /end date/i,
    });
    await act(async () => {
      await updateDate(dateInput, {
        day: "01",
        month: "01",
        year: "3000",
      });
    });

    await user.click(
      within(dialog).getByRole("button", {
        name: /extend closing date/i,
      }),
    );

    // modal is gone and event was fired and no errors
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should not have buttons for publish, delete, close when the status is published", async () => {
    const props = {
      ...EditPoolStory.args,
      ...ExpiredPool.args,
    } as EditPoolFormProps;

    renderWithProviders(<ExpiredPool {...props} />);

    expect(
      screen.queryByRole("button", { name: /publish/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /close/i }),
    ).not.toBeInTheDocument();
  });
});
