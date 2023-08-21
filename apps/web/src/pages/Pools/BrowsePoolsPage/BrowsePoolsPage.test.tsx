/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import React from "react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import { Pool, PoolStatus, PublishingGroup } from "~/api/generated";

import { BrowsePools } from "./BrowsePoolsPage";

const publishedItJobsPool: Pool = {
  id: "publishedItJobsPool",
  publishingGroup: PublishingGroup.ItJobs,
  status: PoolStatus.Published,
};

const expiredItJobsPool: Pool = {
  id: "expiredItJobsPool",
  publishingGroup: PublishingGroup.ItJobs,
  status: PoolStatus.Closed,
};

const archivedItJobsPool: Pool = {
  id: "archivedItJobsPool",
  publishingGroup: PublishingGroup.ItJobs,
  status: PoolStatus.Archived,
};

const publishedExecJobsPool: Pool = {
  id: "publishedExecJobsPool",
  publishingGroup: PublishingGroup.ExecutiveJobs,
  status: PoolStatus.Published,
};

describe("BrowsePoolsPage", () => {
  function renderBrowsePoolsPage({
    pools,
    msDelay = 0,
    responseData = {},
  }: {
    pools: Pool[];
    msDelay?: number;
    responseData?: object;
  }) {
    // Source: https://formidable.com/open-source/urql/docs/advanced/testing/
    const mockClient = {
      executeQuery: jest.fn(() =>
        pipe(fromValue(responseData), delay(msDelay)),
      ),
      // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    return renderWithProviders(
      <GraphqlProvider value={mockClient}>
        <BrowsePools pools={pools} />
      </GraphqlProvider>,
    );
  }
  it("should have no accessibility errors", async () => {
    const { container } = renderBrowsePoolsPage({
      pools: [publishedItJobsPool],
    });
    await axeTest(container);
  });

  it("should only show published jobs", async () => {
    renderBrowsePoolsPage({
      pools: [
        // draft pools can not be returned by API query
        publishedItJobsPool,
        expiredItJobsPool,
        archivedItJobsPool,
      ],
    });

    const links = screen.queryAllByRole("link", {
      name: /Apply to this recruitment/i,
    });

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(publishedItJobsPool.id),
    );
    expect(links[0]).not.toHaveAttribute(
      "href",
      expect.stringContaining(expiredItJobsPool.id),
    );
    expect(links[0]).not.toHaveAttribute(
      "href",
      expect.stringContaining(archivedItJobsPool.id),
    );
  });

  it("should only show IT jobs", async () => {
    renderBrowsePoolsPage({
      pools: [publishedItJobsPool, publishedExecJobsPool],
    });

    const links = screen.queryAllByRole("link", {
      name: /Apply to this recruitment/i,
    });

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(publishedItJobsPool.id),
    );
    expect(links[0]).not.toHaveAttribute(
      "href",
      expect.stringContaining(publishedExecJobsPool.id),
    );
  });
});
