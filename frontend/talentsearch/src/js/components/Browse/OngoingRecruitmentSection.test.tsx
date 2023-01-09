/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { Provider as GraphqlProvider } from "urql";
import { fromValue } from "wonka";
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

const renderBrowsePoolsPage = ({ pools }: OngoingRecruitmentSectionProps) => {
  const mockClient = {
    executeQuery: () =>
      fromValue({
        data: {
          me: undefined,
        },
      }),
  } as never; // Satisfy type for mocking

  return render(
    <GraphqlProvider value={mockClient}>
      <OngoingRecruitmentSection pools={pools} />
    </GraphqlProvider>,
  );
};

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
      closingDate: "2999-01-01 00:00:00",
    };

    // should appear second: tie for expiring second, has first publish date
    const closesSecond = {
      ...publishedPool,
      id: "closesSecond",
      closingDate: "2999-02-01 00:00:00",
    };

    renderBrowsePoolsPage({
      // pass data to the page in an intentionally reversed order
      pools: [closesSecond, closesFirst],
    });

    fireEvent.click(
      await screen.getByRole("button", {
        name: /IT business line advisory services/i,
      }),
    );

    // find the rendered links
    const links = await screen.queryAllByRole("link", {
      name: /apply for technician opportunities/i,
    });

    // ensure there are the right number and in the right order
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(closesSecond.id),
    );
  });
});
