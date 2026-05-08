import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";
import { waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { renderWithProviders } from "@gc-digital-talent/vitest-helpers";
import { fakeSearchRequests } from "@gc-digital-talent/fake-data";

let capturedPagination: { pageSizes?: number[] } | undefined;

vi.mock("~/components/Table/ResponsiveTable/ResponsiveTable", () => ({
  default: ({ pagination }: { pagination?: { pageSizes?: number[] } }) => {
    capturedPagination = pagination;
    return <div data-testid="search-request-table" />;
  },
}));

import SearchRequestTable from "./SearchRequestTable";

const requestsData = fakeSearchRequests();
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

describe("SearchRequestTable page sizes", () => {
  it("passes the 100-row page size option to the table pagination config", async () => {
    capturedPagination = undefined;

    renderWithProviders(
      <GraphqlProvider value={mockClient}>
        <SearchRequestTable title="Title" />
      </GraphqlProvider>,
    );

    await waitFor(() =>
      expect(capturedPagination?.pageSizes).toEqual([10, 20, 50, 100]),
    );
  });
});
