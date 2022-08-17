/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";
import { IntlProvider } from "react-intl";
import WorkLocationSection from "@common/components/UserProfile/ProfileSections/WorkLocationSection";
import UserTableFilterDialog from "./UserTableFilterDialog";
import type { UserTableFilterButtonProps } from "./UserTableFilterDialog";

const mockClient = {
  executeQuery: () => fromValue([]),
} as any;

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
function renderButton(props: Partial<UserTableFilterButtonProps>) {
  return render(
    <UserTableFilterDialog.Button {...props} onSubmit={mockSubmit} />,
    {
      wrapper: Providers,
    },
  );
}

const openDialog = () => {
  fireEvent.click(screen.getByRole("button", { name: /filter/i }));
};

const closeDialog = () => {
  fireEvent.click(screen.getByRole("button", { name: /close dialog/i }));
};

const setFilter = (fieldLabel: string | RegExp, optionLabel: string) => {
  fireEvent.mouseDown(screen.getByRole("combobox", { name: fieldLabel }), {
    button: 0,
  });
  fireEvent.keyDown(screen.getByText(optionLabel), {
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
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("can be set to start with modal open", () => {
      renderButton({ isOpenDefault: true });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
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
      fireEvent.click(screen.getByRole("button", { name: /clear/i }));
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("closes the dialog on submission", async () => {
      renderButton({ isOpenDefault: true });
      await submitFilters();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("submits filter data", async () => {
      renderButton({ isOpenDefault: true });

      setFilter(/work locations/i, "Atlantic");

      await submitFilters();
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      const activeFilter = mockSubmit.mock.lastCall[0];
      expect(activeFilter.workRegion).toHaveLength(1);
    });
  });

  describe("form data", () => {
    it("doesn't persist form data changes when modal closed with X", async () => {
      renderButton({ isOpenDefault: true });

      setFilter(/work locations/i, "Atlantic");

      closeDialog();
      openDialog();

      await submitFilters();

      // No submitted data.
      const activeFilter = mockSubmit.mock.lastCall[0];
      expect(activeFilter.workRegion).toHaveLength(0);
    });

    it("persists form data when modal submitted and re-opened", async () => {
      renderButton({ isOpenDefault: true });

      expect(screen.queryByText("Atlantic")).not.toBeInTheDocument();
      setFilter(/work locations/i, "Atlantic");
      expect(screen.getByText("Atlantic")).toBeInTheDocument();

      await submitFilters();

      openDialog();
      expect(screen.getByText("Atlantic")).toBeInTheDocument();

      await submitFilters();
      expect(mockSubmit).toHaveBeenCalledTimes(2);
      const activeFilter = mockSubmit.mock.lastCall[0];
      expect(activeFilter.workRegion).toHaveLength(1);
    });
  });

  describe("clear button", () => {
    it.skip("clears prior form data when submitted", () => {});
    it.skip("keeps prior form data when not submitted", () => {});
  });

  it("shows all filters in modal", () => {
    renderButton({ isOpenDefault: true });
    expect(screen.getAllByRole("combobox")).toHaveLength(10);
  });

  describe("enableEducationType prop", () => {
    it("hide education filter when not enabled", () => {
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
      ).toBeInTheDocument();
    });

    it("submits education form data when enabled", async () => {
      renderButton({
        isOpenDefault: true,
        enableEducationType: true,
      });
      await submitFilters();
      expect(mockSubmit.mock.lastCall[0]).toMatchObject({ educationType: [] });
    });
  });
});
