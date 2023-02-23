/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { act, screen } from "@testing-library/react";
import { fakeUsers } from "@gc-digital-talent/fake-data";
import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";
import { User, WorkRegion } from "~/api/generated";
import WorkLocationForm, { WorkLocationFormProps } from "./WorkLocationForm";

const renderWorkLocationForm = ({
  initialData,
  handleWorkLocationPreference,
}: WorkLocationFormProps) =>
  renderWithProviders(
    <WorkLocationForm
      initialData={initialData}
      handleWorkLocationPreference={handleWorkLocationPreference}
    />,
  );

const mockUser = fakeUsers()[0];

const mockInitialData: User = {
  __typename: "User",
  id: "thanka11",
  locationPreferences: [WorkRegion.Atlantic],
  locationExemptions: "dagu",
};
const mockInitialEmptyData: User = {
  __typename: "User",
  id: "thanka11",
  locationPreferences: undefined,
  locationExemptions: "",
};

describe("WorkLocationForm", () => {
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderWorkLocationForm({
        initialData: mockInitialData,
        handleWorkLocationPreference: jest.fn(),
      });

      await axeTest(container);
    });
  });
  it("should render fields", async () => {
    const mockSave = jest.fn(() => Promise.resolve(mockUser));

    await act(async () => {
      renderWorkLocationForm({
        initialData: mockInitialData,
        handleWorkLocationPreference: mockSave,
      });
    });

    expect(
      await screen.getByRole("button", {
        name: /Save and go back/i,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("checkbox", {
        name: /Virtual: Work from home/i,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("checkbox", {
        name: /National Capital Region: Ottawa/i,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("checkbox", {
        name: /Atlantic Region: New Brunswick/i,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("checkbox", {
        name: /Quebec Region: excluding Gatineau/i,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("checkbox", {
        name: /Ontario Region: excluding Ottawa/i,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("checkbox", {
        name: /Prairie Region: Manitoba, Saskatchewan/i,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.getByRole("checkbox", {
        name: /British Columbia Region/i,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.getByLabelText(/Location exemptions/i),
    ).toBeInTheDocument();
  });
  it("Can't submit unless form is valid (at least one location selected)", async () => {
    const onClick = jest.fn();

    renderWorkLocationForm({
      initialData: { ...mockInitialEmptyData },
      handleWorkLocationPreference: onClick,
    });

    await act(() => {
      screen.getByRole("button", { name: /save/i }).click();
    });

    expect(onClick).not.toHaveBeenCalled();
  });

  it("Should submit successfully with required fields", async () => {
    const onClick = jest.fn(() => Promise.resolve(mockUser));

    renderWorkLocationForm({
      initialData: { ...mockInitialData },
      handleWorkLocationPreference: onClick,
    });

    await act(() => {
      screen.getByRole("button", { name: /save/i }).click();
    });

    expect(onClick).toHaveBeenCalled();
  });
});
