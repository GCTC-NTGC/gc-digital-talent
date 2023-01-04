/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { screen, act } from "@testing-library/react";
import { axeTest, render } from "@common/helpers/testUtils";
import {
  AdvertisementStatus,
  PoolAdvertisement,
  PublishingGroup,
} from "../../api/generated";
import {
  ActiveRecruitmentSection,
  ActiveRecruitmentSectionProps,
} from "./ActiveRecruitmentSection";

const publishedPool: PoolAdvertisement = {
  id: "publishedPool",
  publishingGroup: PublishingGroup.ItJobs,
  advertisementStatus: AdvertisementStatus.Published,
};

const renderBrowsePoolsPage = ({ pools }: ActiveRecruitmentSectionProps) =>
  render(<ActiveRecruitmentSection pools={pools} />);

describe("BrowsePoolsPage", () => {
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderBrowsePoolsPage({
        pools: [publishedPool],
      });
      await axeTest(container);
    });
  });

  // sort logic: by expiry date whichever one expires first should appear first on the list
  // sort logic: if they have the same expiry date, whichever one was published first should appear first
  it("should properly sort jobs", async () => {
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
      pools: [publishedSecond, publishedFirst, closesFirst],
    });

    // find the rendered links
    const links = await screen.queryAllByRole("link", {
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
