/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { fakeUsers } from "@gc-digital-talent/fake-data";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { act } from "react-dom/test-utils";
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
  const user = userEvent.setup();
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

    await waitFor(async () => {
      user.click(
        await screen.findByRole("button", {
          name: /show available equity options/i,
        }),
      );
    });

    await waitFor(async () => {
      expect(
        await screen.getByRole("button", {
          name: /hide available equity options/i,
        }),
      ).toBeInTheDocument();
    });

    if (mockUser.hasDisability) {
      expect(
        await screen.getByRole("button", {
          name: /edit this information for I identify as a person with a disability./i,
        }),
      ).toBeInTheDocument();
    } else {
      await waitFor(async () => {
        expect(
          await screen.getByRole("button", {
            name: /add person with a disability to my profile/i,
          }),
        ).toBeInTheDocument();
      });
    }

    if (mockUser.indigenousCommunities?.length) {
      expect(
        await screen.findByRole("button", {
          name: /Edit this information for I affirm that I am First Nations/i,
        }),
      ).toBeInTheDocument();
    } else {
      await waitFor(async () => {
        expect(
          await screen.findByRole("button", {
            name: /add indigenous identity to my profile/i,
          }),
        ).toBeInTheDocument();
      });
    }

    if (mockUser.isVisibleMinority) {
      expect(
        await screen.findByRole("button", {
          name: /edit this information for I identify as a member of a visible minority./i,
        }),
      ).toBeInTheDocument();
    } else {
      await waitFor(async () => {
        expect(
          await screen.findByRole("button", {
            name: /add visible minority to my profile/i,
          }),
        ).toBeInTheDocument();
      });
    }
    if (mockUser.isWoman) {
      expect(
        await screen.findByRole("button", {
          name: /edit this information for i identify as a woman./i,
        }),
      ).toBeInTheDocument();
    } else {
      await waitFor(async () => {
        expect(
          await screen.findByRole("button", {
            name: /add woman to my profile/i,
          }),
        ).toBeInTheDocument();
      });
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

    await waitFor(async () => {
      user.click(
        await screen.findByRole("button", {
          name: /available equity options/i,
        }),
      );
    });

    await waitFor(async () => {
      user.click(
        await screen.findByRole("button", {
          name: /add Woman to my profile/i,
        }),
      );
    });

    await waitFor(async () => {
      expect(
        await screen.queryByRole("dialog", { name: /woman/i }),
      ).toBeInTheDocument();
    });
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

    await waitFor(async () => {
      user.click(
        await screen.findByRole("button", {
          name: /available equity options/i,
        }),
      );
    });

    await waitFor(async () => {
      user.click(
        await screen.findByRole("button", {
          name: /add Woman to my profile/i,
        }),
      );
    });

    await waitFor(async () => {
      user.click(
        await screen.findByRole("button", {
          name: /save/i,
        }),
      );
    });

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
