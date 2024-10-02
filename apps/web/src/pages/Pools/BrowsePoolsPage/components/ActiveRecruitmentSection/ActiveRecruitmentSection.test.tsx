/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import {
  PoolStatus,
  PublishingGroup,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import ActiveRecruitmentSection, {
  ActiveRecruitmentSectionPool_Fragment,
  ActiveRecruitmentSectionProps,
} from "./ActiveRecruitmentSection";

const publishedPool = makeFragmentData(
  {
    id: "publishedPool",
    publishingGroup: PublishingGroup.ItJobs,
    status: PoolStatus.Published,
  },
  ActiveRecruitmentSectionPool_Fragment,
);

const renderBrowsePoolsPage = ({ poolsQuery }: ActiveRecruitmentSectionProps) =>
  renderWithProviders(<ActiveRecruitmentSection poolsQuery={poolsQuery} />);

describe("BrowsePoolsPage", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderBrowsePoolsPage({
      poolsQuery: [publishedPool],
    });
    await axeTest(container);
  });

  // sort logic: by expiry date whichever one expires first should appear first on the list
  // sort logic: if they have the same expiry date, whichever one was published first should appear first
  it("should properly sort jobs", () => {
    // should appear first: it expires first even though it was published later
    const closesFirst = {
      ...publishedPool,
      id: "closesFirst",
      publishedAt: "2000-02-01 00:00:00",
      closingDate: "2999-01-01 00:00:00",
    };

    // should appear second: tie for expiring second, has first publish date
    const publishedFirst = {
      ...publishedPool,
      id: "publishedFirst",
      publishedAt: "2000-01-01 00:00:00",
      closingDate: "2999-02-01 00:00:00",
    };

    // should appear third: tie for expiring second, has second publish date
    const publishedSecond = {
      ...publishedPool,
      id: "publishedSecond",
      publishedAt: "2000-01-02 00:00:00",
      closingDate: "2999-02-01 00:00:00",
    };

    renderBrowsePoolsPage({
      // pass data to the page in an intentionally reversed order
      poolsQuery: [publishedSecond, publishedFirst, closesFirst],
    });

    // find the rendered links
    const links = screen.queryAllByRole("link", {
      name: /Apply to this recruitment/i,
    });

    // ensure there are the right number and in the right order
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(closesFirst.id),
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
