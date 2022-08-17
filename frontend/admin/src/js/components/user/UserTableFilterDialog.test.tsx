/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, act } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";
import { IntlProvider } from "react-intl";
import UserTableFilterDialog from "./UserTableFilterDialog";
// import type { UserTableFilterButtonProps } from "./UserTableFilterDialog";

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

function renderButton(props: any) {
  return render(
    <UserTableFilterDialog.Button onSubmit={mockSubmit} {...props} />,
    {
      wrapper: Providers,
    },
  );
}

beforeEach(() => {
  mockSubmit.mockClear();
});

describe("UserTableFilterDialog", () => {
  describe("UserTableFilterDialog.Button", () => {
    it("modal is hidden by default", () => {
      const { queryByRole } = renderButton({});
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens modal when clicked", () => {
      const { getByRole } = renderButton({});
      fireEvent.click(getByRole("button", { name: /filter/i }));
      expect(getByRole("dialog")).toBeInTheDocument();
    });

    it("can be set to start with modal open", () => {
      const { getByRole } = renderButton({
        isOpenDefault: true,
      });
      expect(getByRole("dialog")).toBeInTheDocument();
    });

    it("can be closed via X button", async () => {
      const { getByRole, queryByRole } = renderButton({
        isOpenDefault: true,
      });
      await act(async () => {
        fireEvent.click(getByRole("button", { name: /close dialog/i }));
      });
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("submit button", () => {
    it("calls submit handler with empty filters", async () => {
      const { getByRole } = renderButton({
        isOpenDefault: true,
      });
      await act(async () => {
        fireEvent.click(getByRole("button", { name: /show results/i }));
      });
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith(emptyFormValues);
    });

    it("doesn't call submit handler when cleared", () => {
      const { getByRole } = renderButton({
        isOpenDefault: true,
      });
      fireEvent.click(getByRole("button", { name: /clear/i }));
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it("closes the dialog on submission", async () => {
      const { queryByRole, getByRole } = renderButton({
        isOpenDefault: true,
      });
      await act(async () => {
        fireEvent.click(getByRole("button", { name: /show results/i }));
      });
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("form data", () => {
    it.skip("renders form data as filter selections", () => {});
    it.skip("doesn't persist form data changes when modal closed with X", () => {});
    it.skip("persists form data when modal submitted and re-opened", () => {});
  });

  describe("clear button", () => {
    it.skip("clears prior form data when submitted", () => {});
    it.skip("keeps prior form data when not submitted", () => {});
  });

  it("shows all filters in modal", () => {
    const { getAllByRole } = renderButton({
      isOpenDefault: true,
    });
    expect(getAllByRole("combobox")).toHaveLength(10);
  });

  describe("enableEducationType prop", () => {
    it("hide education filter when not enabled", () => {
      const { queryByRole } = renderButton({
        isOpenDefault: true,
      });
      expect(
        queryByRole("combobox", { name: /education/i }),
      ).not.toBeInTheDocument();
    });

    it("shows education filter when enabled", () => {
      const { getByRole, getAllByRole } = renderButton({
        isOpenDefault: true,
        enableEducationType: true,
      });
      expect(getAllByRole("combobox")).toHaveLength(11);
      expect(getByRole("combobox", { name: /education/i })).toBeInTheDocument();
    });

    it("submits education form data when enabled", async () => {
      const { getByRole } = renderButton({
        isOpenDefault: true,
        enableEducationType: true,
      });
      await act(async () => {
        fireEvent.click(getByRole("button", { name: /show results/i }));
      });
      expect(mockSubmit.mock.lastCall[0]).toMatchObject({ educationType: [] });
    });
  });
});
