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

import ClosedJobs from "./ClosedJobsPage";

const closedItJobsPool = {
  id: "closedItJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Closed),
  publishedAt: "2000-01-01",
  closingDate: "2000-01-02",
  archivedAt: null,
};

const openItJobsPool = {
  id: "openItJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Published),
  publishedAt: "2000-01-01",
  closingDate: "2999-01-02",
  archivedAt: null,
};

const archivedItJobsPool = {
  id: "archivedItJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ItJobs),
  status: toLocalizedEnum(PoolStatus.Archived),
  publishedAt: "2000-01-01",
  closingDate: "2000-01-02",
  archivedAt: "2000-01-03",
};

const closedExecJobsPool = {
  id: "closedExecJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.ExecutiveJobs),
  status: toLocalizedEnum(PoolStatus.Closed),
  publishedAt: "2000-01-01",
  closingDate: "2000-01-02",
  archivedAt: null,
};

const closedIAPJobsPool = {
  id: "closedIAPJobsPool",
  publishingGroup: toLocalizedEnum(PublishingGroup.Iap),
  status: toLocalizedEnum(PoolStatus.Closed),
  publishedAt: "2000-01-01",
  closingDate: "2000-01-02",
  archivedAt: null,
};

describe("ClosedJobsPage", () => {
  function renderPage({
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
        <ClosedJobs />
      </GraphqlProvider>,
    );
  }
  it("should have no accessibility errors", async () => {
    const { container } = renderPage({
      pools: [closedItJobsPool],
    });
    await expectNoAccessibilityErrors(container);
  });

  it("should only show closed jobs", () => {
    renderPage({
      pools: [
        // draft pools can not be returned by API query
        closedItJobsPool,
        openItJobsPool,
        archivedItJobsPool,
      ],
    });

    const links = screen.queryAllByRole("link", {
      name: /View job ad/i,
    });

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(closedItJobsPool.id),
    );
    expect(links[0]).not.toHaveAttribute(
      "href",
      expect.stringContaining(openItJobsPool.id),
    );
    expect(links[0]).not.toHaveAttribute(
      "href",
      expect.stringContaining(archivedItJobsPool.id),
    );
  });

  it("should only show IT and Executive jobs", () => {
    renderPage({
      pools: [closedItJobsPool, closedExecJobsPool, closedIAPJobsPool],
    });

    const links = screen.queryAllByRole("link", {
      name: /View job ad/i,
    });

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(closedItJobsPool.id),
    );
    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(closedExecJobsPool.id),
    );
    expect(links[0] && links[1]).not.toHaveAttribute(
      "href",
      expect.stringContaining(closedIAPJobsPool.id),
    );
  });
});
