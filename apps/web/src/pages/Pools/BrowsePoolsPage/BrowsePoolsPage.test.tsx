/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { Pool, PoolStatus, PublishingGroup } from "@gc-digital-talent/graphql";
import { toLocalizedEnum } from "@gc-digital-talent/fake-data";

import BrowsePools from "./BrowsePoolsPage";

const publishedItJobsPool: Pool = {
  id: "publishedItJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Published),
};

const expiredItJobsPool: Pool = {
  id: "expiredItJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Closed),
};

const archivedItJobsPool: Pool = {
  id: "archivedItJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Archived),
};

const publishedExecJobsPool: Pool = {
  id: "publishedExecJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ExecutiveJobs),
  status: toLocalizedEnum(PoolStatus.Published),
};

const publishedIAPJobsPool: Pool = {
  id: "publishedIAPJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.Iap),
  status: toLocalizedEnum(PoolStatus.Published),
};

describe("BrowsePoolsPage", () => {
  function renderBrowsePoolsPage({ pools }: { pools: Pool[] }) {
    // Source: https://formidable.com/open-source/urql/docs/advanced/testing/
    const mockClient = {
      executeQuery: () =>
        fromValue({
          data: {
            publishedPools: pools,
          },
        }),
    };

    return renderWithProviders(
      <GraphqlProvider value={mockClient}>
        <BrowsePools />
      </GraphqlProvider>,
    );
  }
  it("should have no accessibility errors", async () => {
    const { container } = renderBrowsePoolsPage({
      pools: [publishedItJobsPool],
    });
    await axeTest(container);
  });

  it("should only show published jobs", () => {
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

  it("should only show IT and Executive jobs", () => {
    renderBrowsePoolsPage({
      pools: [publishedItJobsPool, publishedExecJobsPool, publishedIAPJobsPool],
    });

    const links = screen.queryAllByRole("link", {
      name: /Apply to this recruitment/i,
    });

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(publishedItJobsPool.id),
    );
    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(publishedExecJobsPool.id),
    );
    expect(links[0] && links[1]).not.toHaveAttribute(
      "href",
      expect.stringContaining(publishedIAPJobsPool.id),
    );
  });
});
