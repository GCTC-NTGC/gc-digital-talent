/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { createIntl, createIntlCache } from "react-intl";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { PoolCandidateStatus } from "@gc-digital-talent/graphql";

import { getCandidateStatusPill } from "./poolCandidate";
import {
  candidateFullyQualified,
  candidateFullyQualifiedExceptMissingEducation,
  candidateHoldOnMiddleStepAndNoResultsOnFinalStep,
  candidateNoAssessments,
  candidateOneFailingAssessment,
  candidateQualifiedExceptHoldOnFinalAssessment,
  candidateQualifiedExceptHoldOnMiddleAssessment,
  candidateUnfinishedFinalAssessment,
  poolWithAssessmentSteps,
} from "./testData";

describe("PoolCandidate utils", () => {
  const intlCache = createIntlCache();
  const intl = createIntl(
    {
      locale: "en",
    },
    intlCache,
  );
  describe("Candidate Status pill", () => {
    const candidate = fakePoolCandidates(1)[0];

    it('should return "Qualified" in success color for QUALIFIED_AVAILABLE and all PLACED statuses', () => {
      const statuses = [
        PoolCandidateStatus.QualifiedAvailable,
        PoolCandidateStatus.PlacedTentative,
        PoolCandidateStatus.PlacedCasual,
        PoolCandidateStatus.PlacedTerm,
        PoolCandidateStatus.PlacedIndeterminate,
      ];
      statuses.forEach((status) => {
        candidate.status = status;
        const { label, color } = getCandidateStatusPill(candidate, [], intl);
        expect(label).toBe("Qualified");
        expect(color).toBe("success");
      });
    });

    it('should return "Disqualified" in error color for non-removed SCREENED OUT statuses', () => {
      const statuses = [
        PoolCandidateStatus.ScreenedOutApplication,
        PoolCandidateStatus.ScreenedOutAssessment,
      ];
      statuses.forEach((status) => {
        candidate.status = status;
        const { label, color } = getCandidateStatusPill(candidate, [], intl);
        expect(label).toBe("Disqualified");
        expect(color).toBe("error");
      });
    });

    it('should return "Removed" in black color for removed statuses, along with reason for removal', () => {
      candidate.status = PoolCandidateStatus.ScreenedOutNotInterested;
      let pill = getCandidateStatusPill(candidate, [], intl);
      expect(pill.label).toBe("Removed: To assess");
      expect(pill.color).toBe("black");

      candidate.status = PoolCandidateStatus.ScreenedOutNotResponsive;
      pill = getCandidateStatusPill(candidate, [], intl);
      expect(pill.label).toBe("Removed: To assess");
      expect(pill.color).toBe("black");

      candidate.status = PoolCandidateStatus.QualifiedUnavailable;
      pill = getCandidateStatusPill(candidate, [], intl);
      expect(pill.label).toBe("Removed: Qualified");
      expect(pill.color).toBe("black");
      expect(pill.color).toBe("black");

      candidate.status = PoolCandidateStatus.Removed;
      pill = getCandidateStatusPill(candidate, [], intl);
      expect(pill.label).toBe("Removed"); // This status was only for legacy candidates, and its hard to interpret exact reason
      expect(pill.color).toBe("black");

      candidate.status = PoolCandidateStatus.Expired;
      pill = getCandidateStatusPill(candidate, [], intl);
      expect(pill.label).toBe("Expired: Qualified"); // Okay technically this one doesn't say Removed
      expect(pill.color).toBe("black");
    });
    describe("Candidates in assessment", () => {
      it('should return "Qualified: Pending decision" and success color for candidates with an assessment status who have passed all AssessmentSteps', () => {
        const pill = getCandidateStatusPill(
          candidateFullyQualified,
          poolWithAssessmentSteps.assessmentSteps,
          intl,
        );
        expect(pill.label).toBe("Qualified: Pending decision");
        expect(pill.color).toBe("success");
      });
      it('should return "Qualified: Pending decision" and success color for candidates with a Hold status on a middle step, and qualified otherwise', () => {
        const pill = getCandidateStatusPill(
          candidateQualifiedExceptHoldOnMiddleAssessment,
          poolWithAssessmentSteps.assessmentSteps,
          intl,
        );
        expect(pill.label).toBe("Qualified: Pending decision");
        expect(pill.color).toBe("success");
      });
      it('should return "To assess: Step 1" with warning color for candidates missing education assessment', () => {
        const pill = getCandidateStatusPill(
          candidateFullyQualifiedExceptMissingEducation,
          poolWithAssessmentSteps.assessmentSteps,
          intl,
        );
        expect(pill.label).toBe("To assess: Step 1");
        expect(pill.color).toBe("warning");
      });
      it('should return "To assess: Step 1" with warning color for candidates with no assessments', () => {
        const pill = getCandidateStatusPill(
          candidateNoAssessments,
          poolWithAssessmentSteps.assessmentSteps,
          intl,
        );
        expect(pill.label).toBe("To assess: Step 1");
        expect(pill.color).toBe("warning");
      });
      it('should return "To assess: Step 3" with warning color for candidate qualified except for hold on final (third) step', () => {
        const pill = getCandidateStatusPill(
          candidateQualifiedExceptHoldOnFinalAssessment,
          poolWithAssessmentSteps.assessmentSteps,
          intl,
        );
        expect(pill.label).toBe("To assess: Step 3");
        expect(pill.color).toBe("warning");
      });
      it('should return "To assess: Step 3" with warning color for candidate with incomplete final (third) step', () => {
        let pill = getCandidateStatusPill(
          candidateHoldOnMiddleStepAndNoResultsOnFinalStep,
          poolWithAssessmentSteps.assessmentSteps,
          intl,
        );
        expect(pill.label).toBe("To assess: Step 3");
        expect(pill.color).toBe("warning");

        pill = getCandidateStatusPill(
          candidateUnfinishedFinalAssessment,
          poolWithAssessmentSteps.assessmentSteps,
          intl,
        );
        expect(pill.label).toBe("To assess: Step 3");
        expect(pill.color).toBe("warning");
      });
      it('should return "Disqualified: Pending decision" with error color for candidate with any one unsuccessful step', () => {
        const pill = getCandidateStatusPill(
          candidateOneFailingAssessment,
          poolWithAssessmentSteps.assessmentSteps,
          intl,
        );
        expect(pill.label).toBe("Disqualified: Pending decision");
        expect(pill.color).toBe("error");
      });
    });
  });
});
