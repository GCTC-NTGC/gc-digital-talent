/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, act } from "@testing-library/react";
import React from "react";
import { axeTest, render } from "@common/helpers/testUtils";
import { BrowsePools, BrowsePoolsProps } from "./BrowsePoolsPage";
import {
  AdvertisementStatus,
  PoolAdvertisement,
  PublishingGroup,
} from "../../api/generated";

const publishedItJobsPool: PoolAdvertisement = {
  id: "publishedItJobsPool",
  publishingGroup: PublishingGroup.ItJobs,
  advertisementStatus: AdvertisementStatus.Published,
};

const expiredItJobsPool: PoolAdvertisement = {
  id: "expiredItJobsPool",
  publishingGroup: PublishingGroup.ItJobs,
  advertisementStatus: AdvertisementStatus.Expired,
};

const archivedItJobsPool: PoolAdvertisement = {
  id: "archivedItJobsPool",
  publishingGroup: PublishingGroup.ItJobs,
  advertisementStatus: AdvertisementStatus.Archived,
};

const publishedExecJobsPool: PoolAdvertisement = {
  id: "publishedExecJobsPool",
  publishingGroup: PublishingGroup.ExecutiveJobs,
  advertisementStatus: AdvertisementStatus.Published,
};

const renderBrowsePoolsPage = ({ poolAdvertisements }: BrowsePoolsProps) =>
  render(<BrowsePools poolAdvertisements={poolAdvertisements} />);

describe("BrowsePoolsPage", () => {
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderBrowsePoolsPage({
        poolAdvertisements: [publishedItJobsPool],
      });
      await axeTest(container);
    });
  });

  it("should only show published jobs", async () => {
    await act(async () => {
      renderBrowsePoolsPage({
        poolAdvertisements: [
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
  });

  it("should only show IT jobs", async () => {
    await act(async () => {
      renderBrowsePoolsPage({
        poolAdvertisements: [publishedItJobsPool, publishedExecJobsPool],
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

  // sort logic: by expiry date whichever one expires first should appear first on the list
  // sort logic: if they have the same expiry date, whichever one was published first should appear first
  it("should properly sort jobs", async () => {
    await act(async () => {
      // should appear first: it expires first even though it was published later
      const expiresFirst = {
        ...publishedItJobsPool,
        id: "expiresFirst",
        publishedAt: "2000-02-01 00:00:00",
        expiryDate: "2999-01-01 00:00:00",
      };

      // should appear second: tie for expiring second, has first publish date
      const publishedFirst = {
        ...publishedItJobsPool,
        id: "publishedFirst",
        publishedAt: "2000-01-01 00:00:00",
        expiryDate: "2999-02-01 00:00:00",
      };

      // should appear third: tie for expiring second, has second publish date
      const publishedSecond = {
        ...publishedItJobsPool,
        id: "publishedSecond",
        publishedAt: "2000-01-02 00:00:00",
        expiryDate: "2999-02-01 00:00:00",
      };

      renderBrowsePoolsPage({
        // pass data to the page in an intentionally reversed order
        poolAdvertisements: [publishedSecond, publishedFirst, expiresFirst],
      });

      // find the rendered links
      const links = await screen.queryAllByRole("link", {
        name: /Apply to this recruitment/i,
      });

      // ensure there are the right number and in the right order
      expect(links).toHaveLength(3);
      expect(links[0]).toHaveAttribute(
        "href",
        expect.stringContaining(expiresFirst.id),
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
});
