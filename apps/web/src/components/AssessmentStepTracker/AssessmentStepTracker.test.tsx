/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";
import { faker } from "@faker-js/faker";
import { screen } from "@testing-library/react";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import {
  fakeAssessmentSteps,
  fakePoolCandidates,
  fakePools,
} from "@gc-digital-talent/fake-data";

import { ArmedForcesStatus, AssessmentDecision } from "~/api/generated";

import AssessmentStepTracker, {
  AssessmentStepTrackerProps,
} from "./AssessmentStepTracker";

const fakePool = fakePools(1)[0];
const fakeAssessmentStep = fakeAssessmentSteps(1)[0];
const fakeCandidates = fakePoolCandidates(4);

const priorityEntitlementCandidate = {
  ...fakeCandidates[0],
  user: {
    ...fakeCandidates[0].user,
    firstName: "priority",
    lastName: "entitlement",
    hasPriorityEntitlement: true,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
  isBookmarked: false,
  assessmentResults: [
    {
      id: faker.string.uuid(),
      assessmentDecision: AssessmentDecision.Successful,
    },
  ],
};
const armedForcesCandidate = {
  ...fakeCandidates[1],
  user: {
    ...fakeCandidates[1].user,
    firstName: "armed",
    lastName: "forces",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.Veteran,
  },
  isBookmarked: false,
  assessmentResults: [
    {
      id: faker.string.uuid(),
      assessmentDecision: AssessmentDecision.Successful,
    },
  ],
};
const bookmarkedCandidate = {
  ...fakeCandidates[2],
  user: {
    ...fakeCandidates[2].user,
    firstName: "bookmarked",
    lastName: "candidate",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
  isBookmarked: true,
  assessmentResults: [
    {
      id: faker.string.uuid(),
      assessmentDecision: AssessmentDecision.Successful,
    },
  ],
};
const unassessedCandidate = {
  ...fakeCandidates[3],
  user: {
    ...fakeCandidates[3].user,
    firstName: "unassessed",
    lastName: "candidate",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
  isBookmarked: false,
  assessmentResults: [
    {
      id: faker.string.uuid(),
      assessmentDecision: AssessmentDecision.NotSure,
    },
  ],
};
const testCandidates = [
  priorityEntitlementCandidate,
  armedForcesCandidate,
  bookmarkedCandidate,
  unassessedCandidate,
];

// This should always make the component visible
const defaultProps: AssessmentStepTrackerProps = {
  pool: {
    ...fakePool,
    assessmentSteps: [
      {
        ...fakeAssessmentStep,
        assessmentResults: testCandidates.map((candidate) => ({
          ...candidate.assessmentResults[0],
          poolCandidate: candidate,
        })),
      },
    ],
  },
};

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
  // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const renderAssessmentStepTracker = (
  overrideProps?: AssessmentStepTrackerProps,
) => {
  const props = {
    ...defaultProps,
    ...overrideProps,
  };
  return renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <AssessmentStepTracker {...props} />
    </GraphqlProvider>,
  );
};

describe("AssessmentStepTracker", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderAssessmentStepTracker();
    await axeTest(container);
  });

  it("should display candidates with the correct ordinals", () => {
    renderAssessmentStepTracker();

    expect(
      screen.getByRole("link", {
        name: `1. ${unassessedCandidate.user.firstName} ${unassessedCandidate.user.lastName}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `2. ${priorityEntitlementCandidate.user.firstName} ${priorityEntitlementCandidate.user.lastName}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `3. ${armedForcesCandidate.user.firstName} ${armedForcesCandidate.user.lastName}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `4. ${bookmarkedCandidate.user.firstName} ${bookmarkedCandidate.user.lastName}`,
      }),
    ).toBeInTheDocument();
  });

  it("should display candidates in the correct order", () => {
    renderAssessmentStepTracker();

    const candidate1 = screen.getByRole("link", {
      name: /bookmarked candidate/i,
    });
    const candidate2 = screen.getByRole("link", {
      name: /unassessed candidate/i,
    });
    const candidate3 = screen.getByRole("link", {
      name: /priority entitlement/i,
    });
    const candidate4 = screen.getByRole("link", {
      name: /armed forces/i,
    });
    expect(candidate1.compareDocumentPosition(candidate2)).toBe(4);
    expect(candidate2.compareDocumentPosition(candidate3)).toBe(4);
    expect(candidate3.compareDocumentPosition(candidate4)).toBe(4);
  });
});
