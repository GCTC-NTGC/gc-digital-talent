/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";
import { screen } from "@testing-library/react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { fakeSearchRequests } from "@gc-digital-talent/fake-data";

import SearchRequestTable from "./SearchRequestTable";

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
};

const renderSearchRequestsTable = () =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <SearchRequestTable title="Title" />
    </GraphqlProvider>,
  );

describe("SearchRequestsTable", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderSearchRequestsTable();
    await axeTest(container);
  });

  it("Should render the table", async () => {
    renderSearchRequestsTable();

    // Assert table filled with values and the result of requests[0] is present
    expect(screen.getAllByText(`${requestOne.jobTitle ?? ""}`)).toBeTruthy();
    expect(
      screen.getAllByText(requestOne.department?.name.en ?? ""),
    ).toBeTruthy();

    // Table header buttons exist
    expect(
      screen.getByRole("button", { name: /Filter by/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Filters/ })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /show or hide columns/i }),
    ).toBeInTheDocument();
  });
});
