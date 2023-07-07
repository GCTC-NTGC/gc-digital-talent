/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";
import { fakeUsers } from "@gc-digital-talent/fake-data";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import EmploymentEquityForm, {
  type EmploymentEquityFormProps,
} from "./EmploymentEquityForm";

import type { EmploymentEquityUpdateHandler } from "../../types";

const mockUser = fakeUsers()[0];

const renderDiversityEquityInclusionForm = ({
  user,
  onUpdate,
  isMutating,
}: EmploymentEquityFormProps) =>
  renderWithProviders(
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
  it("should render proper buttons", async () => {
    const mockSave = jest.fn();
    renderDiversityEquityInclusionForm({
      user: mockUser,
      onUpdate: mockSave,
      isMutating: false,
    });

    const addDisability = screen.queryByRole("button", {
      name: /add person with a disability to my profile/i,
    });
    const removeDisability = screen.queryByRole("button", {
      name: /edit this information for I identify as a person with a disability./i,
    });

    if (mockUser.hasDisability) {
      expect(addDisability).not.toBeInTheDocument();
      expect(removeDisability).toBeInTheDocument();
    } else {
      expect(addDisability).toBeInTheDocument();
      expect(removeDisability).not.toBeInTheDocument();
    }

    const addIndigenous = screen.queryByRole("button", {
      name: /add indigenous identity to my profile/i,
    });
    const removeIndigenous = screen.queryByRole("button", {
      name: /Edit this information for I affirm that I am First Nations/i,
    });

    if (mockUser.indigenousCommunities?.length) {
      expect(addIndigenous).not.toBeInTheDocument();
      expect(removeIndigenous).toBeInTheDocument();
    } else {
      expect(addIndigenous).toBeInTheDocument();
      expect(removeIndigenous).not.toBeInTheDocument();
    }

    const addVisibleMinority = screen.queryByRole("button", {
      name: /add visible minority to my profile/i,
    });
    const removeVisibleMinority = screen.queryByRole("button", {
      name: /edit this information for I identify as a member of a visible minority./i,
    });

    if (mockUser.isVisibleMinority) {
      expect(addVisibleMinority).not.toBeInTheDocument();
      expect(removeVisibleMinority).toBeInTheDocument();
    } else {
      expect(addVisibleMinority).toBeInTheDocument();
      expect(removeVisibleMinority).not.toBeInTheDocument();
    }

    const addWoman = screen.queryByRole("button", {
      name: /add woman to my profile/i,
    });
    const removeWoman = screen.queryByRole("button", {
      name: /edit this information for i identify as a woman./i,
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
      name: /add Woman to my profile/i,
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
      name: /add Woman to my profile/i,
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
