import { screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";

import {
  expectNoAccessibilityErrors,
  renderWithProviders,
} from "@gc-digital-talent/vitest-helpers";
import type { Pool } from "@gc-digital-talent/graphql";
import { PoolStatus, PublishingGroup } from "@gc-digital-talent/graphql";
import { toLocalizedEnum } from "@gc-digital-talent/fake-data";

import OpenJobs from "./OpenJobsPage";

const publishedItJobsPool = {
  id: "publishedItJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Published),
};

const expiredItJobsPool = {
  id: "expiredItJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Closed),
};

const archivedItJobsPool = {
  id: "archivedItJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Archived),
};

const publishedExecJobsPool = {
  id: "publishedExecJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ExecutiveJobs),
  status: toLocalizedEnum(PoolStatus.Published),
};

const publishedIAPJobsPool = {
  id: "publishedIAPJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.Iap),
  status: toLocalizedEnum(PoolStatus.Published),
};

describe("OpenJobsPage", () => {
  function renderOpenJobsPage({
    pools,
  }: {
    pools: Omit<Pool, "activities" | "teamId" | "wasClosedEarly">[];
  }) {
    // Source: https://formidable.com/open-source/urql/docs/advanced/testing/
    const mockClient = {
      executeQuery: () =>
        fromValue({
          data: {
            poolsPaginated: {
              data: pools,
            },
          },
        }),
    };

    return renderWithProviders(
      <GraphqlProvider value={mockClient}>
        <OpenJobs />
      </GraphqlProvider>,
    );
  }
  it("should have no accessibility errors", async () => {
    const { container } = renderOpenJobsPage({
      pools: [publishedItJobsPool],
    });
    await expectNoAccessibilityErrors(container);
  });

  it("should only show published jobs", () => {
    renderOpenJobsPage({
      pools: [
        // draft pools can not be returned by API query
        publishedItJobsPool,
        expiredItJobsPool,
        archivedItJobsPool,
      ],
    });

    const links = screen.queryAllByRole("link", {
      name: /Apply to/i,
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
    renderOpenJobsPage({
      pools: [publishedItJobsPool, publishedExecJobsPool, publishedIAPJobsPool],
    });

    const links = screen.queryAllByRole("link", {
      name: /Apply to/i,
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
