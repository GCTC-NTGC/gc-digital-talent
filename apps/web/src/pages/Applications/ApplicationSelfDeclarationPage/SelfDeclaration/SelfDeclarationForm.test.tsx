/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import {
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import React from "react";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import SelfDeclarationForm, {
  SelfDeclarationFormProps,
} from "./SelfDeclarationForm";

const renderSelfDeclarationForm = (props: SelfDeclarationFormProps) =>
  renderWithProviders(<SelfDeclarationForm {...props} />);

const mockCallback = jest.fn();

describe("SelfDeclarationForm", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderSelfDeclarationForm({
      onSubmit: mockCallback,
    });

    await axeTest(container);
  });

  it("should not display communities if not Indigenous", async () => {
    await renderSelfDeclarationForm({
      onSubmit: mockCallback,
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("radio", { name: /i am not a member/i }),
      );
    });

    expect(
      await screen.queryByRole("checkbox", { name: /i am first nations/i }),
    ).not.toBeInTheDocument();

    expect(
      await screen.queryByRole("checkbox", { name: /i am inuk/i }),
    ).not.toBeInTheDocument();

    expect(
      await screen.queryByRole("checkbox", { name: /i am métis/i }),
    ).not.toBeInTheDocument();

    expect(
      await screen.queryByRole("checkbox", {
        name: /i don't see my community/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("should display communities if Indigenous", async () => {
    await renderSelfDeclarationForm({
      onSubmit: mockCallback,
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("radio", { name: /i affirm that/i }),
      );
    });

    expect(
      await screen.findByRole("checkbox", { name: /i am first nations/i }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("checkbox", { name: /i am inuk/i }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("checkbox", { name: /i am métis/i }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("checkbox", {
        name: /i don't see my community/i,
      }),
    ).toBeInTheDocument();
  });

  it("should display status field if Indigenous and First Nations", async () => {
    await renderSelfDeclarationForm({
      onSubmit: mockCallback,
    });

    await act(async () => {
      fireEvent.click(
        await screen.getByRole("radio", { name: /i affirm that/i }),
      );
    });

    const checkbox = await screen.findByRole("checkbox", {
      name: /i am first nations/i,
    });

    expect(checkbox).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(checkbox);
    });

    expect(
      await screen.queryByRole("group", { name: /first nations status/i }),
    ).toBeInTheDocument();
  });

  it("should display alert if community selected with other", async () => {
    await renderSelfDeclarationForm({
      onSubmit: mockCallback,
    });

    fireEvent.click(
      await screen.getByRole("radio", { name: /i affirm that/i }),
    );

    fireEvent.click(
      await screen.findByRole("checkbox", {
        name: /i am inuk/i,
      }),
    );

    fireEvent.click(
      await screen.findByRole("checkbox", {
        name: /i don't see my community/i,
      }),
    );

    expect(
      await within(await screen.findByRole("alert")).findByRole("heading", {
        name: /are you sure/i,
      }),
    ).toBeInTheDocument();
  });

  it("should submit with all required fields", async () => {
    const mockSave = jest.fn();

    renderSelfDeclarationForm({
      onSubmit: mockSave,
    });

    fireEvent.click(
      await screen.getByRole("radio", { name: /i affirm that/i }),
    );

    fireEvent.click(
      await screen.findByRole("checkbox", {
        name: /i am first nations/i,
      }),
    );

    fireEvent.click(
      await screen.findByRole("radio", {
        name: /i am status first nations/i,
      }),
    );

    fireEvent.change(
      await screen.findByRole("textbox", {
        name: /signature/i,
      }),
      {
        target: {
          value: "test",
        },
      },
    );

    const saveBtn = await screen.findByRole("button", {
      name: /sign and continue/i,
    });

    fireEvent.submit(saveBtn);

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });

  it("should fail submission without required fields", async () => {
    const mockSave = jest.fn();

    renderSelfDeclarationForm({
      onSubmit: mockSave,
    });

    fireEvent.click(
      await screen.getByRole("radio", { name: /i affirm that/i }),
    );

    fireEvent.click(
      await screen.findByRole("checkbox", {
        name: /i am first nations/i,
      }),
    );

    const saveBtn = await screen.findByRole("button", {
      name: /sign and continue/i,
    });

    fireEvent.submit(saveBtn);

    await waitFor(() => {
      expect(mockSave).not.toHaveBeenCalled();
    });
  });
});
