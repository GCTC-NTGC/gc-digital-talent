/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { fakeUsers } from "@common/fakeData";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  axeTest,
} from "@common/helpers/testUtils";
import { User, WorkRegion } from "../../api/generated";
import {
  WorkLocationPreferenceForm,
  WorkLocationPreferenceFormProps,
} from "./WorkLocationPreferenceForm";

const renderWorkLocationPreferenceForm = ({
  initialData,
  handleWorkLocationPreference,
}: WorkLocationPreferenceFormProps) =>
  render(
    <WorkLocationPreferenceForm
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

describe("WorkLocationPreferenceForm", () => {
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderWorkLocationPreferenceForm({
        initialData: mockInitialData,
        handleWorkLocationPreference: jest.fn(),
      });

      await axeTest(container);
    });
  });
  it("should render fields", async () => {
    const mockSave = jest.fn(() => Promise.resolve(mockUser));

    await act(async () => {
      renderWorkLocationPreferenceForm({
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

    renderWorkLocationPreferenceForm({
      initialData: { ...mockInitialEmptyData },
      handleWorkLocationPreference: onClick,
    });

    fireEvent.submit(await screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(onClick).not.toHaveBeenCalled();
    });
  });
  it("Should submit successfully with required fields", async () => {
    const onClick = jest.fn(() => Promise.resolve(mockUser));

    renderWorkLocationPreferenceForm({
      initialData: { ...mockInitialData },
      handleWorkLocationPreference: onClick,
    });

    fireEvent.submit(await screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
    });
  });
});
