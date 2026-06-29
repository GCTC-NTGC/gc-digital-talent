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

  // sort logic: by close date whichever one closed most recently should appear first on the list
  // sort logic: if they have the same close date, whichever one was published most recently appear first
  it("should properly sort jobs", () => {
    // should appear first: it closed last and published last
    const closedLastPublishedLast = {
      ...closedPool,
      id: "closedLastPublishedLast",
      publishedAt: "2000-02-01 00:00:00",
      closingDate: "2000-03-01 00:00:00",
    };

    // should appear second: tie for closing last, has first publish date
    const closedLastPublishedFirst = {
      ...closedPool,
      id: "closedLastPublishedFirst",
      publishedAt: "2000-01-01 00:00:00",
      closingDate: "2000-03-01 00:00:00",
    };

    // should appear third: first closing date, tie for first publish date
    const closedFirstPublishedFirst = {
      ...closedPool,
      id: "closedFirstPublishedFirst",
      publishedAt: "2000-01-01 00:00:00",
      closingDate: "2000-02-01 00:00:00",
    };

    renderSection({
      // pass data to the page in an intentionally reversed order
      poolsQuery: [
        closedFirstPublishedFirst,
        closedLastPublishedFirst,
        closedLastPublishedLast,
      ],
    });

    // find the rendered links
    const links = screen.queryAllByRole("link", {
      name: /View job ad/i,
    });

    // ensure there are the right number and in the right order
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(closedLastPublishedLast.id),
    );
    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(closedLastPublishedFirst.id),
    );
    expect(links[2]).toHaveAttribute(
      "href",
      expect.stringContaining(closedFirstPublishedFirst.id),
    );
  });
});
