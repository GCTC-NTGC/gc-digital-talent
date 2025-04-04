/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import {
  fakePoolCandidates,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import {
  FinalDecision,
  PoolCandidateStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import ApplicationCard, {
  ApplicationCardProps,
  ApplicationCard_Fragment,
} from "./ApplicationCard";

const mockApplication = fakePoolCandidates()[0];

const defaultProps = {
  poolCandidateQuery: makeFragmentData(
    mockApplication,
    ApplicationCard_Fragment,
  ),
  onDelete: jest.fn(),
};

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
};

const renderCard = (props: ApplicationCardProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <ApplicationCard {...props} />
    </GraphqlProvider>,
  );

describe("ApplicationCard", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderCard(defaultProps);
    await axeTest(container);
  });

  it("should have proper action links if the application is in draft", () => {
    renderCard({
      ...defaultProps,
      poolCandidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.Draft),
          pool: {
            ...mockApplication.pool,
            closingDate: FAR_FUTURE_DATE,
          },
        },
        ApplicationCard_Fragment,
      ),
    });
    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(mockApplication.id),
    );
  });

  it("should have proper label and action links if placed/hired in pool", () => {
    renderCard({
      ...defaultProps,
      poolCandidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.PlacedCasual),
          expiryDate: FAR_FUTURE_DATE,
          suspendedAt: new Date().toUTCString(),
          finalDecisionAt: FAR_PAST_DATE,
          finalDecision: {
            value: FinalDecision.QualifiedPlaced,
          },
        },
        ApplicationCard_Fragment,
      ),
    });

    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(2);
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

    const successfulLabel = screen.queryByText("Qualified in process");
    expect(successfulLabel).toBeInTheDocument();
  });

  it("should have proper label if the application is draft but the pool is expired", () => {
    renderCard({
      ...defaultProps,
      poolCandidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.DraftExpired),
          pool: {
            ...mockApplication.pool,
            closingDate: FAR_PAST_DATE,
          },
          submittedAt: null,
        },
        ApplicationCard_Fragment,
      ),
    });
    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(2);
    const expiredLabel = screen.queryByText("Expired");

    expect(expiredLabel).toBeInTheDocument();
  });
});
