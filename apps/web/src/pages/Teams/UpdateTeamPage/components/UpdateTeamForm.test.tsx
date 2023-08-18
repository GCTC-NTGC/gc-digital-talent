/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, act, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { fakeTeams } from "@gc-digital-talent/fake-data";

import UpdateTeamForm, { UpdateTeamFormProps } from "./UpdateTeamForm";

// adjust mockTeam to enable testing expected values
// must ensure name is kebab-ed and that roleAssignments are not passed into the mutation
const mockTeam = fakeTeams(1)[0];
if (mockTeam.displayName) {
  mockTeam.displayName.en = "Uppercase No Kebab";
}
mockTeam.roleAssignments = [{ id: "fake assignment" }];

const renderUpdateTeamForm = (props: UpdateTeamFormProps) => {
  return renderWithProviders(<UpdateTeamForm {...props} />);
};

describe("UpdateTeamForm", () => {
  it("should submit correctly", async () => {
    const mockSave = jest.fn(() => Promise.resolve(mockTeam));

    act(() => {
      renderUpdateTeamForm({
        team: mockTeam,
        onSubmit: mockSave,
      });
    });

    const contactEmail = screen.getByRole("textbox", {
      name: /contact email/i,
    });
    fireEvent.change(contactEmail, { target: { value: "test@test.com" } });

    fireEvent.submit(
      screen.getByRole("button", { name: /save team information/i }),
    );

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith(mockTeam.id, {
        contactEmail: "test@test.com",
        departments: {
          sync: mockTeam.departments?.map((department) => department?.id),
        },
        description: mockTeam.description,
        displayName: mockTeam.displayName,
        name: "uppercase-no-kebab",
      });
    });
  });
});
