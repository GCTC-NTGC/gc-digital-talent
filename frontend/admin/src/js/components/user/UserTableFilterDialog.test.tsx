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

function noop() {
  // does nothing.
}

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

function renderButton(props: any) {
  return render(<UserTableFilterDialog.Button {...props} />, {
    wrapper: Providers,
  });
}

describe("UserTableFilterDialog", () => {
  it("button: hides modal by default", () => {
    const { queryByRole } = renderButton({ onSubmit: noop });
    expect(
      queryByRole("dialog", { name: /select filters/i }),
    ).not.toBeInTheDocument();
  });

  it("button: opens modal when clicked", () => {
    const { getByRole } = renderButton({ onSubmit: noop });
    fireEvent.click(getByRole("button", { name: /filter/i }));
    expect(
      getByRole("dialog", { name: /select filters/i }),
    ).toBeInTheDocument();
  });

  it("button: can be set to start with modal open", () => {
    const { getByRole } = renderButton({
      onSubmit: noop,
      isOpenDefault: true,
    });
    expect(
      getByRole("dialog", { name: /select filters/i }),
    ).toBeInTheDocument();
  });

  describe("submit button", () => {
    it("calls submit handler with empty filters", async () => {
      const mockSubmit = jest.fn();
      const { getByRole } = renderButton({
        onSubmit: mockSubmit,
        isOpenDefault: true,
      });
      await act(async () => {
        fireEvent.click(getByRole("button", { name: /show results/i }));
      });
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith(emptyFormValues);
    });

    it.skip("doesn't call submit handler when cleared", () => {});
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
      onSubmit: noop,
      isOpenDefault: true,
    });
    expect(getAllByRole("combobox")).toHaveLength(10);
  });

  describe("enableEducationType prop", () => {
    it("hide education filter when not enabled", () => {
      const mockSubmit = jest.fn();
      const { queryByRole } = renderButton({
        onSubmit: mockSubmit,
        isOpenDefault: true,
      });
      expect(
        queryByRole("combobox", { name: /education/i }),
      ).not.toBeInTheDocument();
    });

    it("shows education filter when enabled", () => {
      const mockSubmit = jest.fn();
      const { getByRole, getAllByRole } = renderButton({
        onSubmit: mockSubmit,
        isOpenDefault: true,
        enableEducationType: true,
      });
      expect(getAllByRole("combobox")).toHaveLength(11);
      expect(getByRole("combobox", { name: /education/i })).toBeInTheDocument();
    });

    it("submits education form data when enabled", async () => {
      const mockSubmit = jest.fn();
      const { getByRole } = renderButton({
        onSubmit: mockSubmit,
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
