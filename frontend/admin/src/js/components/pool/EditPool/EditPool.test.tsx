/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { EditPoolFormProps } from "./EditPool";
import EditPoolStory, {
  DraftAdvertisement,
  PublishedAdvertisement,
  ExpiredAdvertisement,
} from "./EditPool.stories";

const renderWithReactIntl = (
  component: React.ReactNode,
  locale?: "en" | "fr",
  messages?: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  return render(
    <IntlProvider locale={locale || "en"} messages={messages}>
      {component}
    </IntlProvider>,
  );
};

describe("Edit Pool tests", () => {
  it("should have save buttons that emit a save event when the status is draft", async () => {
    const handleSave = jest.fn();
    const props = {
      ...EditPoolStory.args,
      ...DraftAdvertisement.args,
      onSave: handleSave,
    } as EditPoolFormProps;

    await act(async () => {
      renderWithReactIntl(<DraftAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /save pool name/i }));
      fireEvent.click(
        screen.getByRole("button", { name: /save closing date/i }),
      );
      fireEvent.click(
        screen.getByRole("button", { name: /save introduction/i }),
      );
      fireEvent.click(screen.getByRole("button", { name: /save work tasks/i }));
      fireEvent.click(
        screen.getByRole("button", { name: /save essential skills/i }),
      );
      fireEvent.click(
        screen.getByRole("button", { name: /save asset skills/i }),
      );
      fireEvent.click(
        screen.getByRole("button", { name: /save other requirements/i }),
      );
    });

    expect(handleSave).toHaveBeenCalledTimes(7);
  });

  it("should have only publish and delete buttons that emit events when the status is draft", async () => {
    const handlePublish = jest.fn();
    const handleDelete = jest.fn();
    const props = {
      ...EditPoolStory.args,
      ...DraftAdvertisement.args,
      onPublish: handlePublish,
      onDelete: handleDelete,
    } as EditPoolFormProps;

    await act(async () => {
      renderWithReactIntl(<DraftAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /publish/i }));
      fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    });

    expect(handlePublish).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledTimes(1);

    expect(
      screen.queryByRole("button", { name: /close/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /extend/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /archive/i }),
    ).not.toBeInTheDocument();
  });

  it("should have only publish and delete buttons that emit events when the status is draft", async () => {
    const handlePublish = jest.fn();
    const handleDelete = jest.fn();
    const props = {
      ...EditPoolStory.args,
      ...DraftAdvertisement.args,
      onPublish: handlePublish,
      onDelete: handleDelete,
    } as EditPoolFormProps;

    await act(async () => {
      renderWithReactIntl(<DraftAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /publish/i }));
      fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    });

    expect(handlePublish).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledTimes(1);

    expect(
      screen.queryByRole("button", { name: /close/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /extend/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /archive/i }),
    ).not.toBeInTheDocument();
  });

  it("should have only close and extend buttons that emit events when the status is published", async () => {
    const handleClose = jest.fn();
    const handleExtend = jest.fn();
    const props = {
      ...EditPoolStory.args,
      ...PublishedAdvertisement.args,
      onClose: handleClose,
      onExtend: handleExtend,
    } as EditPoolFormProps;

    await act(async () => {
      renderWithReactIntl(<PublishedAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /close/i }));
      fireEvent.click(screen.getByRole("button", { name: /extend/i }));
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleExtend).toHaveBeenCalledTimes(1);

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

  it("should have only extend that emit events and archive button is disabled when the status is expired", async () => {
    const handleExtend = jest.fn();
    const props = {
      ...EditPoolStory.args,
      ...ExpiredAdvertisement.args,
      onExtend: handleExtend,
    } as EditPoolFormProps;

    await act(async () => {
      renderWithReactIntl(<ExpiredAdvertisement {...props} />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /extend/i }));
    });

    const archiveButton = screen.getByRole("button", { name: /archive/i });
    expect(archiveButton).toBeDisabled();

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
