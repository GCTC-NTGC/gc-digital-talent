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
import { PAGE_SECTION_ID } from "~/pages/Profile/ResumeAndRecruitmentPage/constants";

import { PoolCandidateStatus } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import TrackApplicationsCard, {
  TrackApplicationsCardProps,
} from "./TrackApplicationsCard";

const mockApplication = fakePoolCandidates()[0];

const defaultProps = {
  application: mockApplication,
  onDelete: jest.fn(),
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

  it("should have proper label and action links if placed/hired in pool", async () => {
    renderCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.PlacedCasual,
        expiryDate: FAR_FUTURE_DATE,
        suspendedAt: new Date().toUTCString(),
      },
    });
    const paths = useRoutes();

    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(5);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(mockApplication.id),
    );
    expect(links[0]).toHaveTextContent("Review application");

    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(mockApplication.pool.id),
    );
    expect(links[1]).toHaveTextContent("Review job ad");

    expect(links[2]).toHaveTextContent("Visit résumé");
    expect(links[2]).toHaveAttribute(
      "href",
      expect.stringContaining(PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES),
    );
    expect(links[3]).toHaveTextContent("Manage availability");
    expect(links[3]).toHaveAttribute(
      "href",
      expect.stringContaining(mockApplication.pool.id),
    );

    expect(links[4]).toHaveTextContent("Get support");
    expect(links[4]).toHaveAttribute(
      "href",
      expect.stringContaining(paths.support()),
    );
    const qualifiedLabel = screen.queryByText("Qualified");

    expect(qualifiedLabel).toBeInTheDocument();
  });

  it("should have proper label if the application is draft but the pool is expired", async () => {
    renderCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.DraftExpired,
        expiryDate: FAR_PAST_DATE,
      },
    });
    const links = await screen.queryAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(mockApplication.id),
    );
    const qualifiedLabel = screen.queryByText("Qualified");

    expect(qualifiedLabel).toBeInTheDocument();
  });
});
