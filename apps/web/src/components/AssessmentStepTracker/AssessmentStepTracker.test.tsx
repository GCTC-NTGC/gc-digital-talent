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
import {
  AssessmentResultType,
  Pool,
  PoolSkillType,
} from "@gc-digital-talent/graphql";

import {
  ArmedForcesStatus,
  AssessmentDecision,
  AssessmentResult,
} from "~/api/generated";

import AssessmentStepTracker, {
  AssessmentStepTrackerProps,
} from "./AssessmentStepTracker";
import { groupPoolCandidatesByStep, sortResultsAndAddOrdinal } from "./utils";
import { NO_DECISION } from "../../utils/assessmentResults";

const fakePool = fakePools(1)[0];
const fakeAssessmentStep = fakeAssessmentSteps(1)[0];
const fakeCandidates = fakePoolCandidates(4);

const getAssessmentResult = (
  decision?: AssessmentDecision | null,
): AssessmentResult => ({
  id: faker.string.uuid(),
  assessmentDecision:
    typeof decision === "undefined" ? AssessmentDecision.Successful : decision,
  assessmentStep: fakeAssessmentStep,
});

const priorityEntitlementCandidate = {
  ...fakeCandidates[0],
  id: "priority-entitlement",
  user: {
    ...fakeCandidates[0].user,
    firstName: "priority",
    lastName: "entitlement",
    hasPriorityEntitlement: true,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
};
const armedForcesCandidate = {
  ...fakeCandidates[1],
  id: "armed-forces",
  user: {
    ...fakeCandidates[1].user,
    firstName: "armed",
    lastName: "forces",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.Veteran,
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult()],
};
const bookmarkedCandidate = {
  ...fakeCandidates[2],
  id: "bookmarked",
  user: {
    ...fakeCandidates[2].user,
    firstName: "bookmarked",
    lastName: "candidate",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
  isBookmarked: true,
  assessmentResults: [getAssessmentResult()],
};
const unassessedCandidate = {
  ...fakeCandidates[3],
  id: "unassessed",
  user: {
    ...fakeCandidates[3].user,
    firstName: "unassessed",
    lastName: "candidate",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
  isBookmarked: false,
  assessmentResults: [getAssessmentResult(null)],
};
const unassessedWithSuccess = {
  ...unassessedCandidate,
  assessmentResults: [
    {
      ...getAssessmentResult(),
      type: AssessmentResultType.Skill,
      poolSkill: {
        id: faker.string.uuid(),
        type: PoolSkillType.Nonessential,
      },
    },
  ],
};
const lastByFirstName = {
  ...unassessedWithSuccess,
  id: "last-by-first-name",
  isBookmarked: false,
  user: {
    id: faker.string.uuid(),
    firstName: "BB",
    lastName: "AA",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
};
const firstByName = {
  ...unassessedWithSuccess,
  id: "first-by-name",
  isBookmarked: false,
  user: {
    id: faker.string.uuid(),
    firstName: "AA",
    hasPriorityEntitlement: false,
    armedForcesStatus: ArmedForcesStatus.NonCaf,
  },
};

const testCandidates = [
  priorityEntitlementCandidate,
  armedForcesCandidate,
  bookmarkedCandidate,
  unassessedCandidate,
  unassessedWithSuccess,
  lastByFirstName,
  firstByName,
];

const poolWithAssessmentSteps: Pool = {
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
  poolCandidates: testCandidates,
};

// This should always make the component visible
const defaultProps: AssessmentStepTrackerProps = {
  pool: poolWithAssessmentSteps,
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
        name: `4. ${firstByName.user.firstName} No last name provided`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `5. ${lastByFirstName.user.firstName} ${lastByFirstName.user.lastName}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `6. ${bookmarkedCandidate.user.firstName} ${bookmarkedCandidate.user.lastName}`,
      }),
    ).toBeInTheDocument();
  });

  it("should group results by candidate", () => {
    renderAssessmentStepTracker();

    // Has two results but should only see one link for it
    expect(
      screen.getAllByRole("link", {
        name: `1. ${unassessedCandidate.user.firstName} ${unassessedCandidate.user.lastName}`,
      }),
    ).toHaveLength(1);
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
    expect(candidate1.compareDocumentPosition(candidate2)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(candidate2.compareDocumentPosition(candidate3)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(candidate3.compareDocumentPosition(candidate4)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("should have a working sort function", () => {
    const steps = Array.from(
      groupPoolCandidatesByStep(poolWithAssessmentSteps).values(),
    );
    const modifiedResults = sortResultsAndAddOrdinal(
      Array.from(steps[0].assessments.values()),
    );

    expect(modifiedResults[0].poolCandidate.id).toEqual("bookmarked");
    expect(modifiedResults[0].ordinal).toEqual(6);
    expect(modifiedResults[1].poolCandidate.id).toEqual("unassessed");
    expect(modifiedResults[1].ordinal).toEqual(1);
    expect(modifiedResults[2].poolCandidate.id).toEqual("priority-entitlement");
    expect(modifiedResults[2].ordinal).toEqual(2);
    expect(modifiedResults[3].poolCandidate.id).toEqual("armed-forces");
    expect(modifiedResults[3].ordinal).toEqual(3);
    expect(modifiedResults[4].poolCandidate.id).toEqual("first-by-name");
    expect(modifiedResults[4].ordinal).toEqual(4);
    expect(modifiedResults[5].poolCandidate.id).toEqual("last-by-first-name");
    expect(modifiedResults[5].ordinal).toEqual(5);
  });

  it("should have working group function", () => {
    const groupedResults = groupPoolCandidatesByStep(poolWithAssessmentSteps);
    const { assessments } = Array.from(groupedResults.values())[0];

    // One duplicate candidate accounted for
    expect(assessments.size).toEqual(testCandidates.length - 1);

    /**
     * This can be a little tricky to read. Expected shape:
     *
     * [
     *  {
     *    decision: "noDecision",
     *    poolCandidate: { id: "candidate-is-unassessed" },
     *    results: [
     *      { "assessmentDecision": null },
     *      { "assessmentDecision": "SUCCESSFUL" }
     *    ]
     *  }
     * ]
     */
    expect(Array.from(assessments.values())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          decision: NO_DECISION,
          poolCandidate: expect.objectContaining({
            id: "unassessed",
          }),
          results: expect.arrayContaining([
            expect.objectContaining({ assessmentDecision: null }),
            expect.objectContaining({
              assessmentDecision: AssessmentDecision.Successful,
            }),
          ]),
        }),
      ]),
    );
  });
});
