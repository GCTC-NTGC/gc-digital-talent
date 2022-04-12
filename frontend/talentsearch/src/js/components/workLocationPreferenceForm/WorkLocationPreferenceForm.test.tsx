/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { fakeUsers } from "@common/fakeData";
import { WorkLocationPreferenceQuery, WorkRegion } from "../../api/generated";
import { render, screen, fireEvent, act, waitFor } from "../../tests/testUtils";
import {
  WorkLocationPreferenceForm,
  WorkLocationPreferenceFormProps,
} from "./WorkLocationPreferenceForm";

const renderWorkLocationPreferenceForm = ({
  initialData,
  handleWorkLocationPreference,
}: WorkLocationPreferenceFormProps) => {
  return render(
    <WorkLocationPreferenceForm
      initialData={initialData}
      handleWorkLocationPreference={handleWorkLocationPreference}
    />,
  );
};
const mockUser = fakeUsers()[0];

const mockInitialData: WorkLocationPreferenceQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "thanka11",
    locationPreferences: [WorkRegion.Atlantic],
    locationExemptions: "dagu",
  },
};
const mockInitialEmptyData: WorkLocationPreferenceQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "thanka11",
    locationPreferences: undefined,
    locationExemptions: "",
  },
};

describe("Work Location Preference Form tests", () => {
  test("should render fields", () => {
    const onClick = jest.fn();
    renderWorkLocationPreferenceForm({
      initialData: mockInitialData,
      handleWorkLocationPreference: onClick,
    });
    expect(
      screen.getByRole("button", {
        name: /Save and go back/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: /Virtual: Work from home/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: /National Capital Region: Ottawa/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: /Atlantic Region: New Brunswick/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: /Quebec Region: excluding Gatineau/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: /Ontario Region: excluding Ottawa/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: /Prairie Region: Manitoba, Saskatchewan/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: /British Columbia Region/i,
      }),
    ).toBeInTheDocument();
    const textarea1 = screen.getByLabelText(/Location exemptions/i);
    act(() => {
      fireEvent.change(textarea1, { target: { value: "Woodstock" } });
    });
    expect(textarea1).toHaveValue("Woodstock");
  });
  test("Can't submit unless form is valid (at least one location selected)", async () => {
    const onClick = jest.fn();
    renderWorkLocationPreferenceForm({
      initialData: { ...mockInitialEmptyData },
      handleWorkLocationPreference: onClick,
    });
    fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    expect(onClick).not.toHaveBeenCalled();
  });
  test("Should submit successfully with required fields", async () => {
    const onClick = jest.fn(() => Promise.resolve(mockUser));
    renderWorkLocationPreferenceForm({
      initialData: { ...mockInitialData },
      handleWorkLocationPreference: onClick,
    });
    fireEvent.submit(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
    });
  });
});
