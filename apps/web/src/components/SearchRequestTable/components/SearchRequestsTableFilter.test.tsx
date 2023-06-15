/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import React from "react";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { act, screen } from "@testing-library/react";
import {
  fakeClassifications,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";
import { PoolStream } from "@gc-digital-talent/graphql";

import { selectFilterOption, submitFilters } from "~/utils/jestUtils";

import { SearchRequestsTableFilterDialog } from "./SearchRequestsTableFilterDialog";

const departments = [fakeDepartments()[0]];
const classifications = [fakeClassifications()[0]];

const mockSubmit = jest.fn();
const mockToggle = jest.fn();
const mockClient = {
  executeQuery: () =>
    fromValue({
      data: {
        departments,
        classifications,
      },
    }),
  // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const renderSearchRequestsTableFilterDialog = () =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <SearchRequestsTableFilterDialog
        onSubmit={mockSubmit}
        onOpenChange={mockToggle}
        isOpen
        activeFilters={{
          departments: [],
          status: [],
          classifications: [],
          streams: [],
        }}
      />
    </GraphqlProvider>,
  );

describe("SearchRequestsTableFilterDialog", () => {
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderSearchRequestsTableFilterDialog();
      await axeTest(container);
    });
  });

  it("Should render the filter", async () => {
    await act(async () => {
      renderSearchRequestsTableFilterDialog();
    });

    // assert filter has everything present
    expect(
      screen.getByRole("combobox", { name: /status/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /departments/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /classifications/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /streams/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")).toHaveLength(4);
    expect(
      screen.getByRole("button", { name: /clear filters/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /show results/i }),
    ).toBeInTheDocument();

    // select something and then submit
    await selectFilterOption(/Status/i);
    await selectFilterOption(/Departments/i);
    await selectFilterOption(/Classifications/i);
    await selectFilterOption(/Streams/i);
    await submitFilters();

    expect(mockSubmit).toHaveBeenCalledWith({
      classifications: [classifications[0].id],
      departments: [departments[0].id],
      status: ["DONE"],
      streams: [PoolStream.BusinessAdvisoryServices],
    });
  });
});
