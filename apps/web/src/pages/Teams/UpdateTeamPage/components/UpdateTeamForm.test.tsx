/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/react";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { fakeTeams, fakeDepartments } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import UpdateTeamForm, {
  UpdateTeamFormProps,
  UpdateTeamPage_TeamFragment,
} from "./UpdateTeamForm";
import { TeamDepartmentOption_Fragment } from "../../operations";

// adjust mockTeam to enable testing expected values
// must ensure name is kebab-ed and that roleAssignments are not passed into the mutation
const mockTeam = fakeTeams(1)[0];
const mockDepartments = fakeDepartments();
if (mockTeam.displayName) {
  mockTeam.displayName.en = "Uppercase No Kebab";
}
mockTeam.roleAssignments = [{ id: "fake assignment" }];
const mockTeamFragment = makeFragmentData(
  mockTeam,
  UpdateTeamPage_TeamFragment,
);
const mockDepartmentFragments = mockDepartments.map((department) =>
  makeFragmentData(department, TeamDepartmentOption_Fragment),
);

const renderUpdateTeamForm = (props: UpdateTeamFormProps) => {
  return renderWithProviders(<UpdateTeamForm {...props} />);
};

describe("UpdateTeamForm", () => {
  it("should submit correctly", async () => {
    const mockSave = jest.fn(() => Promise.resolve(mockTeam));

    renderUpdateTeamForm({
      departmentsQuery: mockDepartmentFragments,
      teamQuery: mockTeamFragment,
      onSubmit: mockSave,
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
