/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";
import { IntlProvider } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import { selectFilterOption, submitFilters } from "~/utils/jestUtils";

import UserTableFilters from "./UserTableFilterDialog";
import type { UserTableFiltersProps } from "./UserTableFilterDialog";

const mockClient = {
  executeQuery: () =>
    // Combining all responses into one for simpler test setup,
    // though not how data would ever be returned in app.
    fromValue({
      data: {
        classifications: [{ id: "IT_3", group: "IT", level: "3" }],
        pools: [{ id: "BAR", name: { en: "Bar Pool" } }],
        skills: [{ id: "BAZ", name: { en: "Baz Skill" } }],
        roles: [
          {
            id: "id-123",
            name: ROLE_NAME.PlatformAdmin, // options for roles has some filtering
            displayName: { en: "Role EN", fr: "Role FR" },
          },
        ],
      },
    }),
} as any; // eslint-disable-line

const emptyFormValues = {
  classifications: [],
  employmentDuration: [],
  govEmployee: [],
  languageAbility: [],
  operationalRequirement: [],
  pools: [],
  profileComplete: [],
  skills: [],
  workRegion: [],
  equity: [],
  hasDiploma: [],
  poolCandidateStatus: [],
  priorityWeight: [],
  expiryStatus: [],
  suspendedStatus: [],
  stream: [],
  roles: [],
  publishingGroups: [],
};

interface ProvidersProps {
  children: React.ReactElement;
}
const Providers = ({ children }: ProvidersProps) => (
  <IntlProvider locale="en">
    <GraphqlProvider value={mockClient}>{children}</GraphqlProvider>
  </IntlProvider>
);

const mockSubmit = jest.fn();

// Helpers.
function renderButton(props: Partial<UserTableFiltersProps>) {
  return render(<UserTableFilters {...props} onSubmit={mockSubmit} />, {
    wrapper: Providers,
  });
}

const openDialog = async () => {
  fireEvent.click(await screen.getByRole("button", { name: /filter/i }));
};

const closeDialog = async () => {
  fireEvent.click(await screen.getByRole("button", { name: /close dialog/i }));
};

const clearFilters = async () => {
  await act(async () => {
    fireEvent.click(await screen.getByRole("button", { name: /clear/i }));
  });
};

beforeEach(() => {
  mockSubmit.mockClear();
});

describe("UserTableFilterDialog", () => {
  describe("UserTableFilterDialog.Button", () => {
    it("modal is hidden by default", async () => {
      renderButton({});
      expect(await screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens modal when clicked", async () => {
      renderButton({});
      await openDialog();
      expect(await screen.getByRole("dialog")).toBeVisible();
    });

    it("can be set to start with modal open", async () => {
      renderButton({ isOpenDefault: true });
      expect(await screen.getByRole("dialog")).toBeVisible();
    });

    it("can be closed via X button", async () => {
      renderButton({ isOpenDefault: true });
      await closeDialog();
      expect(await screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("submit button", () => {
    it("calls submit handler with empty filters", async () => {
      renderButton({ isOpenDefault: true });
      await submitFilters();
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith(emptyFormValues);
    });

    it("doesn't call submit handler when cleared", async () => {
      renderButton({ isOpenDefault: true });
      await clearFilters();
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("closes the dialog on submission", async () => {
      renderButton({ isOpenDefault: true });
      await submitFilters();
      expect(await screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // This test is prone to going beyond the 5s default timeout.
    const extendedTimeout = 10 * 1000;
    it(
      "submits non-empty filter data for all filters",
      async () => {
        renderButton({ isOpenDefault: true });

        // Static filters.
        await selectFilterOption(/languages/i);
        await selectFilterOption(/work preferences/i);
        await selectFilterOption(/work locations/i);
        await selectFilterOption(/duration/i);
        await selectFilterOption(/profile complete/i);
        await selectFilterOption(/government employee/i);
        await selectFilterOption(/classifications/i);
        await selectFilterOption(/pools/i);
        await selectFilterOption(/skill filter/i);
        await selectFilterOption(/roles and permissions/i);

        await submitFilters();
        expect(mockSubmit).toHaveBeenCalledTimes(1);

        const activeFilter = mockSubmit.mock.lastCall[0];
        expect(Object.keys(activeFilter)).toHaveLength(18);
        // Static filters.
        expect(activeFilter.workRegion).toHaveLength(1);
        expect(activeFilter.employmentDuration).toHaveLength(1);
        expect(activeFilter.languageAbility).toHaveLength(1);
        expect(activeFilter.operationalRequirement).toHaveLength(1);
        expect(activeFilter.govEmployee).toHaveLength(1);
        expect(activeFilter.profileComplete).toHaveLength(1);

        // Async filters.
        expect(activeFilter.classifications).toHaveLength(1);
        expect(activeFilter.skills).toHaveLength(1);
        expect(activeFilter.pools).toHaveLength(1);
        expect(activeFilter.roles).toHaveLength(1);
      },
      extendedTimeout,
    );
  });

  it("correctly selects work location filter", async () => {
    renderButton({ isOpenDefault: true });

    expect(await screen.queryByText("Telework")).not.toBeInTheDocument();
    await selectFilterOption(/work locations/i);
    expect(await screen.getByText("Telework")).toBeVisible();
  });

  describe("data persistence", () => {
    it("doesn't persist form data changes when modal closed with X", async () => {
      renderButton({ isOpenDefault: true });
      selectFilterOption(/work locations/i);
      closeDialog();

      openDialog();
      expect(screen.queryByText("Telework")).not.toBeInTheDocument();
    });

    it("persists form data when modal submitted and re-opened", async () => {
      renderButton({ isOpenDefault: true });
      await selectFilterOption(/work locations/i);
      await submitFilters();
      await openDialog();
      expect(await screen.getByText("Telework")).toBeVisible();
    });
  });

  describe("prior state", () => {
    beforeEach(async () => {
      renderButton({ isOpenDefault: true });
      await selectFilterOption(/work locations/i);
      await submitFilters();
    });

    it("clears prior state when cleared and submitted", async () => {
      await openDialog();
      await clearFilters();
      await submitFilters();

      await openDialog();
      const location = await screen.queryByText("Telework");
      expect(location).not.toBeInTheDocument();
    });

    it("keeps prior state when cleared but not submitted", async () => {
      await openDialog();
      await clearFilters();
      await closeDialog();

      await openDialog();
      const location = await screen.queryByText("Telework");
      expect(location).toBeInTheDocument();
    });
  });

  it("shows correct filters in modal", () => {
    renderButton({ isOpenDefault: true });
    expect(screen.getAllByRole("combobox")).toHaveLength(10);
  });
});
