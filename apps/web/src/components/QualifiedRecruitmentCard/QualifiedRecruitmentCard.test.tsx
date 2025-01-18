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
  PoolCandidateStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import QualifiedRecruitmentCard, {
  QualifiedRecruitmentCardProps,
  QualifiedRecruitmentCard_Fragment,
} from "./QualifiedRecruitmentCard";

const mockApplication = fakePoolCandidates()[0];
const defaultProps = {
  candidateQuery: makeFragmentData(
    {
      ...mockApplication,
      expiryDate: FAR_FUTURE_DATE,
    },
    QualifiedRecruitmentCard_Fragment,
  ),
};

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
};

const renderCard = (props: QualifiedRecruitmentCardProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <QualifiedRecruitmentCard {...props} />
    </GraphqlProvider>,
  );

describe("QualifiedRecruitmentCard", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderCard(defaultProps);
    await axeTest(container);
  });

  it("PLACED_CASUAL and UN-SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.PlacedCasual),
          suspendedAt: null,
          placedAt: FAR_PAST_DATE,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/hired/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("PLACED_CASUAL and SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.PlacedCasual),
          suspendedAt: FAR_PAST_DATE,
          placedAt: FAR_PAST_DATE,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/hired/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("PLACED_INDETERMINATE and UN-SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.PlacedIndeterminate),
          suspendedAt: null,
          placedAt: FAR_PAST_DATE,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/hired/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("PLACED_INDETERMINATE and SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.PlacedIndeterminate),
          suspendedAt: FAR_PAST_DATE,
          placedAt: FAR_PAST_DATE,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/hired/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("PLACED_TERM and UN-SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.PlacedTerm),
          suspendedAt: null,
          placedAt: FAR_PAST_DATE,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/hired/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("PLACED_TERM and SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.PlacedTerm),
          suspendedAt: FAR_PAST_DATE,
          placedAt: FAR_PAST_DATE,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/hired/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("QUALIFIED_AVAILABLE and UN-SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.QualifiedAvailable),
          suspendedAt: null,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/open to job offers/i)).toBeInTheDocument();
    expect(
      screen.getByText(/you are open to opportunities from this recruitment/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/change your availability/i)).toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("QUALIFIED_AVAILABLE and SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.QualifiedAvailable),
          suspendedAt: FAR_PAST_DATE,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/not interested/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/change your availability/i)).toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("QUALIFIED_UNAVAILABLE and UN-SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.QualifiedUnavailable),
          suspendedAt: null,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/open to job offers/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("QUALIFIED_UNAVAILABLE and SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.QualifiedUnavailable),
          suspendedAt: FAR_PAST_DATE,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/not interested/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("QUALIFIED_WITHDREW and UN-SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.QualifiedWithdrew),
          suspendedAt: null,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/open to job offers/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("QUALIFIED_WITHDREW and SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.QualifiedWithdrew),
          suspendedAt: FAR_PAST_DATE,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/not interested/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("EXPIRED and UN-SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.Expired),
          suspendedAt: null,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/open to job offers/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("EXPIRED and SUSPENDED", () => {
    renderCard({
      ...defaultProps,
      candidateQuery: makeFragmentData(
        {
          ...mockApplication,
          status: toLocalizedEnum(PoolCandidateStatus.Expired),
          suspendedAt: FAR_PAST_DATE,
        },
        QualifiedRecruitmentCard_Fragment,
      ),
    });

    expect(screen.getByText(/not interested/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show the skill assessments of this process/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });
});
