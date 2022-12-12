/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { screen, act, fireEvent } from "@testing-library/react";
import { axeTest, render } from "@common/helpers/testUtils";
import {
  AdvertisementStatus,
  PoolAdvertisement,
  PoolStream,
  PublishingGroup,
} from "../../api/generated";
import {
  OngoingRecruitmentSection,
  OngoingRecruitmentSectionProps,
} from "./OngoingRecruitmentSection";

const publishedPool: PoolAdvertisement = {
  id: "publishedPool",
  publishingGroup: PublishingGroup.ItJobsOngoing,
  advertisementStatus: AdvertisementStatus.Published,
  stream: PoolStream.BusinessAdvisoryServices,
  classifications: [{ id: "it-01", group: "IT", level: 1 }],
};

const renderBrowsePoolsPage = ({ pools }: OngoingRecruitmentSectionProps) =>
  render(<OngoingRecruitmentSection pools={pools} />);

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
    await act(async () => {
      // should appear first: it expires first even though it was published later
      const expiresFirst = {
        ...publishedPool,
        id: "expiresFirst",
        expiryDate: "2999-01-01 00:00:00",
      };

      // should appear second: tie for expiring second, has first publish date
      const expiresSecond = {
        ...publishedPool,
        id: "expiresSecond",
        expiryDate: "2999-02-01 00:00:00",
      };

      renderBrowsePoolsPage({
        // pass data to the page in an intentionally reversed order
        pools: [expiresSecond, expiresFirst],
      });

      fireEvent.click(
        await screen.getByRole("button", {
          name: /IT business line advisory services/i,
        }),
      );

      // find the rendered links
      const links = await screen.queryAllByRole("link", {
        name: /Apply to level 1/i,
      });

      // ensure there are the right number and in the right order
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute(
        "href",
        expect.stringContaining(expiresSecond.id),
      );
    });
  });
});
