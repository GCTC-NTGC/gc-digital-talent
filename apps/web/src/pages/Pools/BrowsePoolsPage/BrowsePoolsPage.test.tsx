/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, act } from "@testing-library/react";
import React from "react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import { PoolStatus, Pool, PublishingGroup } from "~/api/generated";

import { BrowsePools, BrowsePoolsProps } from "./BrowsePoolsPage";

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

const renderBrowsePoolsPage = ({ pools }: BrowsePoolsProps) =>
  renderWithProviders(<BrowsePools pools={pools} />);

describe("BrowsePoolsPage", () => {
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderBrowsePoolsPage({
        pools: [publishedItJobsPool],
      });
      await axeTest(container);
    });
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

    const links = await screen.queryAllByRole("link", {
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

    const links = await screen.queryAllByRole("link", {
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
