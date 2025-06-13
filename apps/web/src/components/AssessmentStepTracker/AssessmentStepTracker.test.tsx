/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  AssessmentDecision,
  PoolCandidateStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import { NO_DECISION } from "~/utils/assessmentResults";

import AssessmentStepTracker, {
  AssessmentStepTrackerProps,
  AssessmentStepTracker_CandidateFragment,
  AssessmentStepTracker_PoolFragment,
} from "./AssessmentStepTracker";
import {
  groupPoolCandidatesByStep,
  sortResultsAndAddOrdinal,
  filterResults,
  ResultFilters,
  filterAlreadyDisqualified,
  CandidateAssessmentResult,
} from "./utils";
import {
  armedForcesCandidate,
  bookmarkedCandidate,
  claimVerificationTestData,
  filterDisqualifiedTestData,
  firstByName,
  lastByFirstName,
  lastByStatus,
  poolWithAssessmentSteps,
  priorityEntitlementCandidate,
  secondLastByStatus,
  testCandidates,
  unassessedCandidate,
} from "./testData";

const defaultFilters: ResultFilters = {
  query: "",
  [NO_DECISION]: true,
  [AssessmentDecision.Successful]: true,
  [AssessmentDecision.Hold]: true,
  [AssessmentDecision.Unsuccessful]: true,
};

const mockFn = jest.fn();

// This should always make the component visible
const defaultProps: AssessmentStepTrackerProps = {
  fetching: false,
  candidateQuery: unpackMaybes(poolWithAssessmentSteps.poolCandidates).map(
    (candidate) =>
      makeFragmentData(candidate, AssessmentStepTracker_CandidateFragment),
  ),
  poolQuery: makeFragmentData(
    poolWithAssessmentSteps,
    AssessmentStepTracker_PoolFragment,
  ),
  onSubmitDialog: mockFn,
};
const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
};

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
  const user = userEvent.setup();

  const enableFilters = async () => {
    await user.click(screen.getByRole("switch", { name: /^successful/i }));
    await user.click(screen.getByRole("switch", { name: /on hold/i }));
    await user.click(screen.getByRole("switch", { name: /unsuccessful/i }));
  };

  it("should display candidates with the correct ordinals", async () => {
    renderAssessmentStepTracker();

    await enableFilters();

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
    expect(
      screen.getByRole("link", {
        name: `7. ${secondLastByStatus.user.firstName} ${secondLastByStatus.user.lastName}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: `8. ${lastByStatus.user.firstName} ${lastByStatus.user.lastName}`,
      }),
    ).toBeInTheDocument();
  });

  it("should group results by candidate", () => {
    renderAssessmentStepTracker();

    // Has two results but should only see one link for it
    expect(
      screen.getAllByRole("link", {
        name: new RegExp(
          `${unassessedCandidate.user.firstName} ${unassessedCandidate.user.lastName}`,
          "i",
        ),
      }),
    ).toHaveLength(1);
  });

  it("should display candidates in the correct order", async () => {
    renderAssessmentStepTracker();

    await enableFilters();

    const firstColumn = screen.getByRole("list", {
      name: /step 1/i,
    });

    const candidate1 = within(firstColumn).getByRole("link", {
      name: /bookmarked candidate/i,
    });
    const candidate2 = within(firstColumn).getByRole("link", {
      name: /unassessed candidate/i,
    });
    const candidate3 = within(firstColumn).getByRole("link", {
      name: /priority entitlement/i,
    });
    const candidate4 = within(firstColumn).getByRole("link", {
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
      groupPoolCandidatesByStep(
        unpackMaybes(poolWithAssessmentSteps.assessmentSteps),
        unpackMaybes(poolWithAssessmentSteps.poolCandidates),
      ),
    );
    const modifiedResults = sortResultsAndAddOrdinal(
      Array.from(steps[0].results),
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
    expect(modifiedResults[6].poolCandidate.id).toEqual(
      "second-last-by-status",
    );
    expect(modifiedResults[6].ordinal).toEqual(7);
    expect(modifiedResults[7].poolCandidate.id).toEqual("last-by-status");
    expect(modifiedResults[7].ordinal).toEqual(8);
  });

  it("should have working group function", () => {
    const groupedResults = groupPoolCandidatesByStep(
      unpackMaybes(poolWithAssessmentSteps.assessmentSteps),
      unpackMaybes(poolWithAssessmentSteps.poolCandidates),
    );
    const stepArray = Array.from(groupedResults.values());
    const { results } = stepArray[0];

    // One duplicate candidate accounted for
    expect(results.length).toEqual(testCandidates.length);

    // They are in the correct order
    const orderArray = Array.from(
      { length: stepArray.length },
      (_x, i) => i + 1,
    );
    const stepOrder = stepArray
      .map((step) => step.step.sortOrder)
      .filter(notEmpty);
    expect(stepOrder).toEqual(orderArray);

    /**
     * This can be a little tricky to read. Expected shape:
     *
     * [
     *  {
     *    decision: "noDecision",
     *    poolCandidate: { id: "candidate-is-unassessed" },
     *  }
     * ]
     */
    expect(Array.from(results)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          decision: NO_DECISION,
          poolCandidate: expect.objectContaining({
            id: "unassessed",
          }),
        }),
      ]),
    );
  });

  it("should have working filter function", () => {
    const groupedResults = groupPoolCandidatesByStep(
      unpackMaybes(poolWithAssessmentSteps.assessmentSteps),
      unpackMaybes(poolWithAssessmentSteps.poolCandidates),
    );

    const [{ results: onlyArmedForcesResults }] = filterResults(
      {
        ...defaultFilters,
        query: "armed",
      },
      groupedResults,
    );

    // Only one item should appear (armed forces)
    expect(onlyArmedForcesResults.length).toEqual(1);
    expect(onlyArmedForcesResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          poolCandidate: expect.objectContaining({
            id: "armed-forces",
          }),
        }),
      ]),
    );

    const [{ results: noToAssessResults }] = filterResults(
      {
        ...defaultFilters,
        [NO_DECISION]: false,
      },
      groupedResults,
    );

    // Only one item should be removed (unassessed candidate)
    expect(noToAssessResults.length).toEqual(testCandidates.length - 1);
    expect(noToAssessResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          poolCandidate: expect.objectContaining({
            id: "unassessed",
          }),
        }),
      ]),
    );

    const [{ results: noSuccessfulResults }] = filterResults(
      {
        ...defaultFilters,
        [AssessmentDecision.Successful]: false,
      },
      groupedResults,
    );

    // Five item should be removed (successful candidates)
    expect(noSuccessfulResults.length).toEqual(testCandidates.length - 5);
    expect(noSuccessfulResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          decision: AssessmentDecision.Successful,
        }),
      ]),
    );

    const [{ results: noUnsuccessfulResults }] = filterResults(
      {
        ...defaultFilters,
        [AssessmentDecision.Unsuccessful]: false,
      },
      groupedResults,
    );

    // Five item should be removed (unsuccessful candidate)
    expect(noUnsuccessfulResults.length).toEqual(testCandidates.length - 1);
    expect(noUnsuccessfulResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          decision: AssessmentDecision.Unsuccessful,
        }),
      ]),
    );

    const [{ results: noHoldResults }] = filterResults(
      {
        ...defaultFilters,
        [AssessmentDecision.Hold]: false,
      },
      groupedResults,
    );

    // Five item should be removed (on hold candidate)
    expect(noHoldResults.length).toEqual(testCandidates.length - 1);
    expect(noHoldResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          decision: AssessmentDecision.Hold,
        }),
      ]),
    );

    //
    const [{ results: noHoldOrSuccessResults }] = filterResults(
      {
        ...defaultFilters,
        [AssessmentDecision.Hold]: false,
        [AssessmentDecision.Successful]: false,
      },
      groupedResults,
    );

    // Fix items should be removed (successful + on hold candidate)
    expect(noHoldOrSuccessResults.length).toEqual(testCandidates.length - 6);
    expect(noHoldOrSuccessResults).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          decision: AssessmentDecision.Hold,
        }),
      ]),
    );
  });

  it("should filter out candidates disqualified before RoD", () => {
    // test array with a length of three, of which one should be filtered out the first with ScreenedOutApplication
    const candidates = filterDisqualifiedTestData;
    expect(candidates.length).toEqual(3);
    const filteredCandidates = filterAlreadyDisqualified(candidates);
    expect(filteredCandidates.length).toEqual(2);
    const attemptToFindFilteredCandidate = filteredCandidates.filter(
      (candidate) =>
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        candidate.status?.value === PoolCandidateStatus.ScreenedOutApplication,
    );
    expect(attemptToFindFilteredCandidate.length).toEqual(0);
  });

  it("should sort candidates by claim verification values", () => {
    const candidates = claimVerificationTestData;
    expect(candidates.length).toEqual(6);

    // type wiggle
    const typeMappedCandidates: CandidateAssessmentResult[] = candidates.map(
      (candidate) => {
        return {
          poolCandidate: candidate,
          decision: "noDecision",
        };
      },
    );
    const sortedCandidates = sortResultsAndAddOrdinal(typeMappedCandidates);

    // assert accepted and unverified precede rejected
    expect(sortedCandidates.length).toEqual(6);
    expect(sortedCandidates[0].poolCandidate.id).toEqual(
      "priority-entitlement-accepted",
    );
    expect(sortedCandidates[1].poolCandidate.id).toEqual(
      "priority-entitlement-unverified",
    );
    expect(sortedCandidates[2].poolCandidate.id).toEqual("veteran-accepted");
    expect(sortedCandidates[3].poolCandidate.id).toEqual("veteran-unverified");
    expect(sortedCandidates[4].poolCandidate.id).toEqual(
      "priority-entitlement-rejected",
    );
    expect(sortedCandidates[5].poolCandidate.id).toEqual("veteran-rejected");
  });
});
