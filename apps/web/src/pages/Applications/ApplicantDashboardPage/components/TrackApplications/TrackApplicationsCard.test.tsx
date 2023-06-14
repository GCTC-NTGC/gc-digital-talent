/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import React from "react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import { PoolCandidateStatus } from "~/api/generated";
import TrackApplicationsCard, {
  TrackApplicationsCardProps,
} from "./TrackApplicationsCard";

const mockApplication = fakePoolCandidates()[0];

const defaultProps = {
  application: mockApplication,
};

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
  // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const renderCard = (props: TrackApplicationsCardProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <TrackApplicationsCard {...props} />
    </GraphqlProvider>,
  );

describe("TrackApplicationsCard", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderCard(defaultProps);
    await axeTest(container);
  });

  it("should have link to remove user from search results", () => {
    renderCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.QualifiedAvailable,
        expiryDate: FAR_FUTURE_DATE,
        suspendedAt: null,
      },
    });

    const removeMeLink = screen.queryByRole("button", {
      name: /remove me/i,
    });

    expect(removeMeLink).toBeInTheDocument();
  });

  it("should have link to add user back into search results", () => {
    renderCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.QualifiedAvailable,
        expiryDate: FAR_FUTURE_DATE,
        suspendedAt: new Date().toUTCString(),
      },
    });

    const addMeLink = screen.queryByRole("button", {
      name: /I want to appear in results again/i,
    });

    expect(addMeLink).toBeInTheDocument();
  });

  it("should have congrats message if placed/hired in pool", () => {
    renderCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.PlacedCasual,
        expiryDate: FAR_FUTURE_DATE,
        suspendedAt: new Date().toUTCString(),
      },
    });

    const congrats = screen.queryByText(
      "Congrats! You were hired as a result of this process. As such, you will no longer appear in talent requests for this recruitment.",
    );

    expect(congrats).toBeInTheDocument();
  });

  // TODO: What message should show if the pool candidate has been placed but the pool is expired
  it("should have expired recruitment message if the pool has expired", () => {
    renderCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.QualifiedAvailable,
        expiryDate: FAR_PAST_DATE,
        suspendedAt: new Date().toUTCString(),
      },
    });

    const expired = screen.queryByText(
      "This recruitment has expired and it is no longer available for hiring opportunities.",
    );

    expect(expired).toBeInTheDocument();
  });

  it("should have expired recruitment message if the admin set application status to expired", () => {
    renderCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.Expired,
        expiryDate: FAR_FUTURE_DATE,
        suspendedAt: new Date().toUTCString(),
      },
    });

    const expired = screen.queryByText(
      "This recruitment has expired and it is no longer available for hiring opportunities.",
    );

    expect(expired).toBeInTheDocument();
  });
});
