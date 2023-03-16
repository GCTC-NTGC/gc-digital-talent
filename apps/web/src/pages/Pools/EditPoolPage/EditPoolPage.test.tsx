/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { currentDate } from "@gc-digital-talent/date-helpers";
import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { EditPoolForm, EditPoolFormProps } from "./EditPoolPage";
import EditPoolStory, {
  DraftAdvertisement,
  PublishedAdvertisement,
  ExpiredAdvertisement,
} from "./EditPoolPage.stories";

jest.setTimeout(500 * 1000);

describe("Edit Pool tests", () => {
  it("should have save buttons that emit a save event when the status is draft", async () => {
    const handleSave = jest.fn();
    const props = {
      ...EditPoolStory.args,
      ...DraftAdvertisement.args,
      onSave: handleSave,
    } as EditPoolFormProps;

    await act(async () => {
      renderWithProviders(<EditPoolForm {...props} />);
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("button", { name: /save pool name/i }),
      );
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("button", { name: /save closing date/i }),
      );
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("button", { name: /save introduction/i }),
      );
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("button", { name: /save work tasks/i }),
      );
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("button", { name: /save essential skills/i }),
      );
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("button", { name: /save asset skills/i }),
      );
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("button", { name: /save other requirements/i }),
      );
    });

    expect(handleSave).toHaveBeenCalledTimes(7);
  });

  it("should have a publish button that pops a modal and emits an event when the status is draft", async () => {
    const handleEvent = jest.fn();
    const props = {
      ...EditPoolStory.args,
      ...DraftAdvertisement.args,
      onPublish: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    await act(async () => {
      renderWithProviders(<DraftAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(await screen.getByRole("button", { name: /publish/i }));
    });

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await act(async () => {
      fireEvent.click(
        within(dialog).getByRole("button", { name: /publish pool/i }),
      );
    });

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should have a delete button that pops a modal and emits an event when the status is draft", async () => {
    const handleEvent = jest.fn();

    const props = {
      ...EditPoolStory.args,
      ...DraftAdvertisement.args,
      onPublish: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    await act(async () => {
      renderWithProviders(<DraftAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(await screen.getByRole("button", { name: /publish/i }));
    });

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await act(async () => {
      fireEvent.click(
        within(dialog).getByRole("button", { name: /publish pool/i }),
      );
    });

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should have a delete button that pops a modal and emits an event when the status is draft", async () => {
    const handleEvent = jest.fn();

    const props = {
      ...EditPoolStory.args,
      ...DraftAdvertisement.args,
      onDelete: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    await act(async () => {
      renderWithProviders(<DraftAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(await screen.getByRole("button", { name: /delete/i }));
    });

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await act(async () => {
      fireEvent.click(within(dialog).getByRole("button", { name: /delete/i }));
    });

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should not have buttons for close, extend, archive when the status is draft", async () => {
    const props = {
      ...EditPoolStory.args,
      ...DraftAdvertisement.args,
    } as EditPoolFormProps;

    await act(async () => {
      renderWithProviders(<DraftAdvertisement {...props} />);
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
      ...PublishedAdvertisement.args,
      onClose: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    await act(async () => {
      renderWithProviders(<PublishedAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(await screen.getByRole("button", { name: /close/i }));
    });

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await act(async () => {
      fireEvent.click(
        within(dialog).getByRole("button", { name: /close pool now/i }),
      );
    });

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should have an extend button that pops a modal and emits an event when the status is published", async () => {
    const handleEvent = jest.fn(() => Promise.resolve());
    const props = {
      ...EditPoolStory.args,
      ...PublishedAdvertisement.args,
      onExtend: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    await act(async () => {
      renderWithProviders(<PublishedAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("button", { name: /extend the date/i }),
      );
    });

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await act(async () => {
      fireEvent.click(
        within(dialog).getByRole("button", { name: /extend closing date/i }),
      );
    });

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should not have buttons for publish, delete, archive when the status is published", async () => {
    const props = {
      ...EditPoolStory.args,
      ...PublishedAdvertisement.args,
    } as EditPoolFormProps;

    await act(async () => {
      renderWithProviders(<PublishedAdvertisement {...props} />);
    });

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
      ...ExpiredAdvertisement.args,
      onExtend: handleEvent,
    } as EditPoolFormProps;

    // render story and click the button to open the modal
    await act(async () => {
      renderWithProviders(<ExpiredAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("button", { name: /extend the date/i }),
      );
    });

    // find the modal
    const dialog = screen.getByRole("dialog");

    // interact with the modal
    await act(async () => {
      fireEvent.change(within(dialog).getByLabelText(/end date/i), {
        target: { value: currentDate() },
      });
      fireEvent.click(
        within(dialog).getByRole("button", { name: /extend closing date/i }),
      );
    });

    // modal is gone and event was fired
    expect(dialog).not.toBeInTheDocument();
    expect(handleEvent).toHaveBeenCalledTimes(1);
  });

  it("should not have buttons for publish, delete, close when the status is published", async () => {
    const props = {
      ...EditPoolStory.args,
      ...ExpiredAdvertisement.args,
    } as EditPoolFormProps;

    await act(async () => {
      renderWithProviders(<ExpiredAdvertisement {...props} />);
    });

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
