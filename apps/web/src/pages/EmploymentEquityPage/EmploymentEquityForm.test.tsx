/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { fakeUsers } from "@common/fakeData";
import { act } from "react-dom/test-utils";
import { axeTest, render } from "@common/helpers/testUtils";
import {
  EmploymentEquityForm,
  type EmploymentEquityFormProps,
} from "./EmploymentEquityForm";

import type { EmploymentEquityUpdateHandler } from "./types";

const mockUser = fakeUsers()[0];

const renderDiversityEquityInclusionForm = ({
  user,
  onUpdate,
  isMutating,
}: EmploymentEquityFormProps) =>
  render(
    <EmploymentEquityForm
      user={user}
      onUpdate={onUpdate}
      isMutating={isMutating}
    />,
  );

describe("DiversityEquityInclusionForm", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderDiversityEquityInclusionForm({
      user: mockUser,
      onUpdate: jest.fn(),
      isMutating: false,
    });

    await axeTest(container);
  });

  /**
   * Checks to see if the proper add/remove buttons
   * are rendered based on the users EE info.
   */
  it("should render proper buttons", () => {
    const mockSave = jest.fn();
    renderDiversityEquityInclusionForm({
      user: mockUser,
      onUpdate: mockSave,
      isMutating: false,
    });

    const addDisability = screen.queryByRole("button", {
      name: /add person with a disability to profile/i,
    });
    const removeDisability = screen.queryByRole("button", {
      name: /remove "I identify as a person with a disability" from profile/i,
    });

    if (mockUser.hasDisability) {
      expect(addDisability).not.toBeInTheDocument();
      expect(removeDisability).toBeInTheDocument();
    } else {
      expect(addDisability).toBeInTheDocument();
      expect(removeDisability).not.toBeInTheDocument();
    }

    const addIndigenous = screen.queryByRole("button", {
      name: /add indigenous identity to profile/i,
    });
    const removeIndigenous = screen.queryByRole("button", {
      name: /remove "I am Indigenous" from profile/i,
    });

    if (mockUser.isIndigenous) {
      expect(addIndigenous).not.toBeInTheDocument();
      expect(removeIndigenous).toBeInTheDocument();
    } else {
      expect(addIndigenous).toBeInTheDocument();
      expect(removeIndigenous).not.toBeInTheDocument();
    }

    const addVisibleMinority = screen.queryByRole("button", {
      name: /add member of a visible minority to profile/i,
    });
    const removeVisibleMinority = screen.queryByRole("button", {
      name: /remove "I identify as a member of a visible minority" from profile/i,
    });

    if (mockUser.isVisibleMinority) {
      expect(addVisibleMinority).not.toBeInTheDocument();
      expect(removeVisibleMinority).toBeInTheDocument();
    } else {
      expect(addVisibleMinority).toBeInTheDocument();
      expect(removeVisibleMinority).not.toBeInTheDocument();
    }

    const addWoman = screen.queryByRole("button", {
      name: /add woman to profile/i,
    });
    const removeWoman = screen.queryByRole("button", {
      name: /remove "i identify as a woman" from profile/i,
    });

    if (mockUser.isWoman) {
      expect(addWoman).not.toBeInTheDocument();
      expect(removeWoman).toBeInTheDocument();
    } else {
      expect(addWoman).toBeInTheDocument();
      expect(removeWoman).not.toBeInTheDocument();
    }
  });

  it("should open modal", async () => {
    const mockSave = jest.fn();
    renderDiversityEquityInclusionForm({
      user: {
        ...mockUser,
        isWoman: false,
      },
      onUpdate: mockSave,
      isMutating: false,
    });

    const addWoman = await screen.findByRole("button", {
      name: /add Woman to profile/i,
    });

    fireEvent.click(addWoman);

    expect(
      await screen.queryByRole("dialog", { name: /woman/i }),
    ).toBeInTheDocument();
  });

  it("should update on save", async () => {
    const mockSave = jest.fn(() =>
      Promise.resolve({ id: "", data: { id: "" } }),
    );
    renderDiversityEquityInclusionForm({
      user: {
        ...mockUser,
        isWoman: false,
      },
      onUpdate: mockSave as EmploymentEquityUpdateHandler,
      isMutating: false,
    });

    const addWoman = await screen.findByRole("button", {
      name: /add Woman to profile/i,
    });

    act(() => {
      fireEvent.click(addWoman);
    });

    const saveBtn = await screen.findByRole("button", {
      name: /save/i,
    });

    act(() => {
      fireEvent.submit(saveBtn);
    });

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
