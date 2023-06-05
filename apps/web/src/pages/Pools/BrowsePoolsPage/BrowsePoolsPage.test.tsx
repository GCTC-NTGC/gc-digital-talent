/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, act } from "@testing-library/react";
import React from "react";

import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";

import {
  AdvertisementStatus,
  PoolAdvertisement,
  PublishingGroup,
} from "~/api/generated";

import { BrowsePools } from "./BrowsePoolsPage";

const publishedItJobsPool: PoolAdvertisement = {
  id: "publishedItJobsPool",
  publishingGroup: PublishingGroup.ItJobs,
  advertisementStatus: AdvertisementStatus.Published,
};

const expiredItJobsPool: PoolAdvertisement = {
  id: "expiredItJobsPool",
  publishingGroup: PublishingGroup.ItJobs,
  advertisementStatus: AdvertisementStatus.Closed,
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

describe("BrowsePoolsPage", () => {
  function renderBrowsePoolsPage({
    poolAdvertisements,
    msDelay = 0,
    responseData = {},
  }: {
    poolAdvertisements: PoolAdvertisement[];
    msDelay?: number;
    responseData?: object;
  }) {
    // Source: https://formidable.com/open-source/urql/docs/advanced/testing/
    const mockClient = {
      executeQuery: jest.fn(() =>
        pipe(fromValue(responseData), delay(msDelay)),
      ),
      // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    return renderWithProviders(
      <GraphqlProvider value={mockClient}>
        <BrowsePools poolAdvertisements={poolAdvertisements} />
      </GraphqlProvider>,
    );
  }
  it("should have no accessibility errors", async () => {
    await act(async () => {
      const { container } = renderBrowsePoolsPage({
        poolAdvertisements: [publishedItJobsPool],
      });
      await axeTest(container);
    });
  });

  it("should only show published jobs", async () => {
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

  it("should only show IT jobs", async () => {
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
