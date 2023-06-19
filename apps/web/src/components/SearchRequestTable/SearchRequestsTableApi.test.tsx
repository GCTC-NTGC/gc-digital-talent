/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import React from "react";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { act, screen } from "@testing-library/react";
import { fakeSearchRequests } from "@gc-digital-talent/fake-data";

import SearchRequestsTable from "./SearchRequestsTableApi";

const requestsData = fakeSearchRequests();
const requestOne = requestsData[0];
const mockPaginatorInfo = {
  count: 20,
  currentPage: 1,
  firstItem: 1,
  hasMorePages: false,
  lastItem: 20,
  lastPage: 1,
  perPage: 20,
  total: 20,
};

const mockClient = {
  executeQuery: () =>
    fromValue({
      data: {
        poolCandidateSearchRequestsPaginated: {
          data: requestsData,
          paginatorInfo: mockPaginatorInfo,
        },
      },
    }),
  // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const renderSearchRequestsTable = () =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <SearchRequestsTable title="Title" />
    </GraphqlProvider>,
  );

describe("SearchRequestsTable", () => {
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderSearchRequestsTable();
      await axeTest(container);
    });
  });

  it("Should render the table", async () => {
    await act(async () => {
      renderSearchRequestsTable();
    });

    // Assert table filled with values and the result of requests[0] is present
    expect(screen.getAllByText(requestOne.fullName ?? "")).toBeTruthy();
    expect(screen.getAllByText(requestOne.jobTitle ?? "")).toBeTruthy();
    expect(
      screen.getAllByText(requestOne.department?.name.en ?? ""),
    ).toBeTruthy();

    // Table header buttons exist
    expect(
      screen.getByRole("button", { name: /All columns/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Filters/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Columns/ })).toBeInTheDocument();
  });
});
