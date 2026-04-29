import { screen } from "@testing-library/react";

import {
  expectNoAccessibilityErrors,
  renderWithProviders,
} from "@gc-digital-talent/vitest-helpers";
import {
  PoolStatus,
  PublishingGroup,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import type { ClosedJobOpportunitiesSectionProps } from "./ClosedJobOpportunitiesSection";
import ClosedJobOpportunitiesSection, {
  ClosedJobOpportunitiesSectionPool_Fragment,
} from "./ClosedJobOpportunitiesSection";

const closedPool = makeFragmentData(
  {
    id: "closedPool",
    publishingGroup: PublishingGroup.ItJobs,
    status: PoolStatus.Closed,
  },
  ClosedJobOpportunitiesSectionPool_Fragment,
);

const renderSection = ({ poolsQuery }: ClosedJobOpportunitiesSectionProps) =>
  renderWithProviders(
    <ClosedJobOpportunitiesSection poolsQuery={poolsQuery} />,
  );

describe("ClosedJobOpportunitiesSection", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderSection({
      poolsQuery: [closedPool],
    });
    await expectNoAccessibilityErrors(container);
  });

  // sort logic: by close date whichever one closed first should appear first on the list
  // sort logic: if they have the same close date, whichever one was published first should appear first
  it("should properly sort jobs", () => {
    // should appear first: it closed first even though it was published later
    const closedFirst = {
      ...closedPool,
      id: "closesFirst",
      publishedAt: "1900-02-01 00:00:00",
      closingDate: "1999-01-01 00:00:00",
    };

    // should appear second: tie for closing second, has first publish date
    const publishedFirst = {
      ...closedPool,
      id: "publishedFirst",
      publishedAt: "1900-01-01 00:00:00",
      closingDate: "1999-02-01 00:00:00",
    };

    // should appear third: tie for closing second, has second publish date
    const publishedSecond = {
      ...closedPool,
      id: "publishedSecond",
      publishedAt: "1900-01-02 00:00:00",
      closingDate: "1999-02-01 00:00:00",
    };

    renderSection({
      // pass data to the page in an intentionally reversed order
      poolsQuery: [publishedSecond, publishedFirst, closedFirst],
    });

    // find the rendered links
    const links = screen.queryAllByRole("link", {
      name: /View job ad/i,
    });

    // ensure there are the right number and in the right order
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(closedFirst.id),
    );
    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(publishedFirst.id),
    );
    expect(links[2]).toHaveAttribute(
      "href",
      expect.stringContaining(publishedSecond.id),
    );
  });
});
