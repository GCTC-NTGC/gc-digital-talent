/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { GetMyStatusQuery } from "../../api/generated";
import { render, screen, fireEvent, waitFor } from "../../tests/testUtils";
import { MyStatusForm, MyStatusFormProps } from "./MyStatusForm";
import {
  MyStatusFormActive,
  MyStatusFormNull,
  MyStatusFormNull2,
} from "./MyStatusForm.stories";

const renderMyStatusForm = ({
  initialData,
  handleMyStatus,
}: MyStatusFormProps) => {
  return render(
    <MyStatusForm initialData={initialData} handleMyStatus={handleMyStatus} />,
  );
};

const mockDataForIncompleteForm: GetMyStatusQuery | undefined =
  MyStatusFormNull2.args;
const mockDataForCompleteForm: GetMyStatusQuery | undefined =
  MyStatusFormActive.args;
const mockEmptyData: GetMyStatusQuery | undefined = MyStatusFormNull.args;

describe("MyStatusForm tests", () => {
  test("Should render fields", () => {
    const onClick = jest.fn();
    renderMyStatusForm({
      initialData: mockEmptyData,
      handleMyStatus: onClick,
    });
    expect(
      screen.getByRole("radio", {
        name: /Actively looking -/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", {
        name: /Open to opportunities - /i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", {
        name: /Inactive - I /i,
      }),
    ).toBeInTheDocument();
  });
  test("If application not complete, inputs disabled and Why can I change my status appears", () => {
    const onClick = jest.fn();
    renderMyStatusForm({
      initialData: mockDataForIncompleteForm,
      handleMyStatus: onClick,
    });
    expect(
      screen.getByRole("radio", {
        name: /Actively looking -/i,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("radio", {
        name: /Open to opportunities - /i,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("radio", {
        name: /Inactive - I /i,
      }),
    ).toBeDisabled();
    expect(
      screen.getByText(`Why can’t I change my status?`),
    ).toBeInTheDocument();
  });
  test("If application complete, inputs enabled and Why can I change my status hidden", () => {
    const onClick = jest.fn();
    renderMyStatusForm({
      initialData: mockDataForCompleteForm,
      handleMyStatus: onClick,
    });
    expect(
      screen.getByRole("radio", {
        name: /Actively looking -/i,
      }),
    ).toBeEnabled();
    expect(
      screen.getByRole("radio", {
        name: /Open to opportunities - /i,
      }),
    ).toBeEnabled();
    expect(
      screen.getByRole("radio", {
        name: /Inactive - I /i,
      }),
    ).toBeEnabled();
    expect(
      screen.queryByText(`Why can’t I change my status?`),
    ).not.toBeInTheDocument();
  });
  test("Submit handler called whenever radio selection changes", async () => {
    const OnClick = jest.fn();
    renderMyStatusForm({
      initialData: mockEmptyData,
      handleMyStatus: OnClick,
    });

    fireEvent.click(
      screen.getByRole("radio", {
        name: /Actively looking -/i,
      }),
    );
    await waitFor(() => expect(OnClick).toHaveBeenCalled());
    fireEvent.click(
      screen.getByRole("radio", {
        name: /Open to opportunities - /i,
      }),
    );
    await waitFor(() => expect(OnClick).toHaveBeenCalled());
    fireEvent.click(
      screen.getByRole("radio", {
        name: /Inactive - I /i,
      }),
    );
    await waitFor(() => expect(OnClick).toHaveBeenCalled());
  });
});
