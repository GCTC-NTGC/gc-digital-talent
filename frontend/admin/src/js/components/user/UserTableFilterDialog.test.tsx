/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";
import { IntlProvider } from "react-intl";
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
      },
    }),
} as any; // eslint-disable-line

const emptyFormValues = {
  classifications: [],
  employmentDuration: [],
  govEmployee: [],
  jobLookingStatus: [],
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

const openDialog = () => {
  fireEvent.click(screen.getByRole("button", { name: /filter/i }));
};

const closeDialog = () => {
  fireEvent.click(screen.getByRole("button", { name: /close dialog/i }));
};

const clearFilters = () => {
  fireEvent.click(screen.getByRole("button", { name: /clear/i }));
};

/**
 * Selects first available option from a given SelectField, or a specific option when label provided.
 * @param fieldLabel label of filter to choose option from.
 * @param optionLabel label for dropdown option to select. (optional)
 */
const selectFilterOption = (
  fieldLabel: string | RegExp,
  optionLabel?: string,
) => {
  fireEvent.mouseDown(screen.getByRole("combobox", { name: fieldLabel }), {
    button: 0,
  });
  const elem = optionLabel
    ? screen.getByText(optionLabel)
    : document.body.querySelector(".react-select__menu");
  if (elem)
    fireEvent.keyDown(elem, {
      keyCode: 13,
      key: "Enter",
    });
};

const submitFilters = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /show results/i }));
  });
};

beforeEach(() => {
  mockSubmit.mockClear();
});

describe("UserTableFilterDialog", () => {
  describe("UserTableFilterDialog.Button", () => {
    it("modal is hidden by default", () => {
      renderButton({});
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens modal when clicked", () => {
      renderButton({});
      openDialog();
      expect(screen.getByRole("dialog")).toBeVisible();
    });

    it("can be set to start with modal open", () => {
      renderButton({ isOpenDefault: true });
      expect(screen.getByRole("dialog")).toBeVisible();
    });

    it("can be closed via X button", () => {
      renderButton({ isOpenDefault: true });
      closeDialog();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("submit button", () => {
    it("calls submit handler with empty filters", async () => {
      renderButton({ isOpenDefault: true });
      await submitFilters();
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith(emptyFormValues);
    });

    it("doesn't call submit handler when cleared", () => {
      renderButton({ isOpenDefault: true });
      clearFilters();
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("closes the dialog on submission", async () => {
      renderButton({ isOpenDefault: true });
      await submitFilters();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // This test is prone to going beyond the 5s default timeout.
    const extendedTimeout = 10 * 1000;
    it(
      "submits non-empty filter data for all filters",
      async () => {
        renderButton({ isOpenDefault: true });

        // Static filters.
        selectFilterOption(/languages/i);
        selectFilterOption(/work preferences/i);
        selectFilterOption(/work locations/i);
        selectFilterOption(/duration/i);
        selectFilterOption(/availability/i);
        selectFilterOption(/profile complete/i);
        selectFilterOption(/government employee/i);

        // TODO: Async filters.
        selectFilterOption(/classifications/i);
        selectFilterOption(/pools/i);
        selectFilterOption(/skill filter/i);

        await submitFilters();
        expect(mockSubmit).toHaveBeenCalledTimes(1);

        const activeFilter = mockSubmit.mock.lastCall[0];
        expect(Object.keys(activeFilter)).toHaveLength(14);
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
      },
      extendedTimeout,
    );
  });

  it("correctly selects work location filter", () => {
    renderButton({ isOpenDefault: true });

    expect(screen.queryByText("Atlantic")).not.toBeInTheDocument();
    selectFilterOption(/work locations/i, "Atlantic");
    expect(screen.getByText("Atlantic")).toBeVisible();
  });

  describe("data persistence", () => {
    it("doesn't persist form data changes when modal closed with X", async () => {
      renderButton({ isOpenDefault: true });
      selectFilterOption(/work locations/i, "Atlantic");
      closeDialog();

      openDialog();
      expect(screen.queryByText("Atlantic")).not.toBeInTheDocument();
    });

    it("persists form data when modal submitted and re-opened", async () => {
      renderButton({ isOpenDefault: true });
      selectFilterOption(/work locations/i, "Atlantic");
      await submitFilters();
      openDialog();
      expect(screen.getByText("Atlantic")).toBeVisible();
    });
  });

  describe("prior state", () => {
    beforeEach(async () => {
      renderButton({ isOpenDefault: true });
      selectFilterOption(/work locations/i, "Atlantic");
      await submitFilters();
    });

    it("clears prior state when cleared and submitted", async () => {
      openDialog();
      clearFilters();
      await submitFilters();

      openDialog();
      expect(screen.queryByText("Atlantic")).not.toBeInTheDocument();
    });

    it("keeps prior state when cleared but not submitted", async () => {
      openDialog();
      clearFilters();
      closeDialog();

      openDialog();
      expect(screen.getByText("Atlantic")).toBeVisible();
    });
  });

  it("shows correct filters in modal", () => {
    renderButton({ isOpenDefault: true });
    expect(screen.getAllByRole("combobox")).toHaveLength(10);
  });

  describe("enableEducationType prop", () => {
    it("hides education filter when not enabled", () => {
      renderButton({ isOpenDefault: true });
      expect(
        screen.queryByRole("combobox", { name: /education/i }),
      ).not.toBeInTheDocument();
    });

    it("shows education filter when enabled", () => {
      renderButton({
        isOpenDefault: true,
        enableEducationType: true,
      });
      expect(screen.getAllByRole("combobox")).toHaveLength(11);
      expect(
        screen.getByRole("combobox", { name: /education/i }),
      ).toBeVisible();
    });

    it("submits empty education data when empty", async () => {
      renderButton({
        isOpenDefault: true,
        enableEducationType: true,
      });
      await submitFilters();

      const activeFilter = mockSubmit.mock.lastCall[0];
      expect(activeFilter.educationType).toBeDefined();
      expect(activeFilter.educationType).toHaveLength(0);
    });

    it("submits education data when populated", async () => {
      renderButton({
        isOpenDefault: true,
        enableEducationType: true,
      });
      selectFilterOption(/education/i);
      selectFilterOption(/education/i);
      await submitFilters();

      const activeFilter = mockSubmit.mock.lastCall[0];
      expect(activeFilter.educationType).toHaveLength(2);
    });
  });
});
