/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { screen, act } from "@testing-library/react";
import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";
import { GetMyStatusQuery } from "~/api/generated";

import { MyStatusFormComponent, MyStatusFormProps } from "./MyStatusForm";
import { MyStatusFormActive, MyStatusFormNull } from "./MyStatusForm.stories";

const renderMyStatusForm = ({
  initialData,
  handleMyStatus,
}: MyStatusFormProps) => {
  return renderWithProviders(
    <MyStatusFormComponent
      initialData={initialData}
      handleMyStatus={handleMyStatus}
    />,
  );
};

const mockDataForIncompleteForm: GetMyStatusQuery | undefined =
  MyStatusFormNull.args;
const mockDataForCompleteForm: GetMyStatusQuery | undefined =
  MyStatusFormActive.args;
const mockEmptyData: GetMyStatusQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "11",
    jobLookingStatus: undefined,
    isProfileComplete: true, // can't change status unless profile is complete
  },
};

describe("MyStatusForm tests", () => {
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderMyStatusForm({
        initialData: mockDataForCompleteForm,
        handleMyStatus: jest.fn(),
      });

      await axeTest(container);
    });
  });

  test("Should render fields", async () => {
    const onClick = jest.fn();
    await act(async () => {
      renderMyStatusForm({
        initialData: mockDataForCompleteForm,
        handleMyStatus: onClick,
      });
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
  test("If application not complete, inputs disabled and Why can I change my status appears", async () => {
    const onClick = jest.fn();
    await act(async () => {
      renderMyStatusForm({
        initialData: mockDataForIncompleteForm,
        handleMyStatus: onClick,
      });
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
  test("If application complete, inputs enabled and Why can I change my status hidden", async () => {
    const onClick = jest.fn();
    await act(async () => {
      renderMyStatusForm({
        initialData: mockDataForCompleteForm,
        handleMyStatus: onClick,
      });
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
    const onClick = jest.fn();
    renderMyStatusForm({
      initialData: mockEmptyData,
      handleMyStatus: onClick,
    });

    await act(async () => {
      await screen
        .getByRole("radio", {
          name: /Actively looking -/i,
        })
        .click();
    });
    expect(onClick).toHaveBeenCalledTimes(1);

    await act(async () => {
      await screen
        .getByRole("radio", {
          name: /Open to opportunities - /i,
        })
        .click();
    });
    expect(onClick).toHaveBeenCalledTimes(2);

    await act(async () => {
      await screen
        .getByRole("radio", {
          name: /Inactive - I /i,
        })
        .click();
    });
    expect(onClick).toHaveBeenCalledTimes(3);
  });
});
