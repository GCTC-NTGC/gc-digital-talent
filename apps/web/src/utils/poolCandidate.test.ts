/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { createIntl, createIntlCache } from "react-intl";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { PoolCandidateStatus } from "@gc-digital-talent/graphql";

import { getCandidateStatusChip } from "./poolCandidate";
import {
  candidateFullyQualified,
  candidateFullyQualifiedExceptMissingEducation,
  candidateHoldOnMiddleStepAndNoResultsOnFinalStep,
  candidateNoAssessments,
  candidateOneFailingAssessment,
  candidateQualifiedExceptHoldOnFinalAssessment,
  candidateQualifiedExceptHoldOnMiddleAssessment,
  candidateUnfinishedFinalAssessment,
} from "./testData";

describe("PoolCandidate utils", () => {
  const intlCache = createIntlCache();
  const intl = createIntl(
    {
      locale: "en",
    },
    intlCache,
  );

  describe("Candidate Status chip", () => {
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
        const { label, color } = getCandidateStatusChip(candidate, intl);
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
        const { label, color } = getCandidateStatusChip(candidate, intl);
        expect(label).toBe("Disqualified");
        expect(color).toBe("error");
      });
    });

    it('should return "Removed" in black color for removed statuses, along with reason for removal', () => {
      candidate.status = PoolCandidateStatus.ScreenedOutNotInterested;
      let chip = getCandidateStatusChip(candidate, intl);
      expect(chip.label).toBe("Removed: To assess");
      expect(chip.color).toBe("black");

      candidate.status = PoolCandidateStatus.ScreenedOutNotResponsive;
      chip = getCandidateStatusChip(candidate, intl);
      expect(chip.label).toBe("Removed: To assess");
      expect(chip.color).toBe("black");

      candidate.status = PoolCandidateStatus.QualifiedUnavailable;
      chip = getCandidateStatusChip(candidate, intl);
      expect(chip.label).toBe("Removed: Qualified");
      expect(chip.color).toBe("black");
      expect(chip.color).toBe("black");

      candidate.status = PoolCandidateStatus.Removed;
      chip = getCandidateStatusChip(candidate, intl);
      expect(chip.label).toBe("Removed"); // This status was only for legacy candidates, and its hard to interpret exact reason
      expect(chip.color).toBe("black");

      candidate.status = PoolCandidateStatus.Expired;
      chip = getCandidateStatusChip(candidate, intl);
      expect(chip.label).toBe("Expired: Qualified"); // Okay technically this one doesn't say Removed
      expect(chip.color).toBe("black");
    });
    describe("Candidates in assessment", () => {
      it('should return "Qualified: Pending decision" and success color for candidates with an assessment status who have passed all AssessmentSteps', () => {
        const chip = getCandidateStatusChip(candidateFullyQualified, intl);
        expect(chip.label).toBe("Qualified: Pending decision");
        expect(chip.color).toBe("success");
      });
      it('should return "Qualified: Pending decision" and success color for candidates with a Hold status on a middle step, and qualified otherwise', () => {
        const chip = getCandidateStatusChip(
          candidateQualifiedExceptHoldOnMiddleAssessment,
          intl,
        );
        expect(chip.label).toBe("Qualified: Pending decision");
        expect(chip.color).toBe("success");
      });
      it('should return "To assess: Step 1" with warning color for candidates missing education assessment', () => {
        const chip = getCandidateStatusChip(
          candidateFullyQualifiedExceptMissingEducation,
          intl,
        );
        expect(chip.label).toBe("To assess: Step 1");
        expect(chip.color).toBe("warning");
      });
      it('should return "To assess: Step 1" with warning color for candidates with no assessments', () => {
        const chip = getCandidateStatusChip(candidateNoAssessments, intl);
        expect(chip.label).toBe("To assess: Step 1");
        expect(chip.color).toBe("warning");
      });
      it('should return "To assess: Step 3" with warning color for candidate qualified except for hold on final (third) step', () => {
        const chip = getCandidateStatusChip(
          candidateQualifiedExceptHoldOnFinalAssessment,
          intl,
        );
        expect(chip.label).toBe("To assess: Step 3");
        expect(chip.color).toBe("warning");
      });
      it('should return "To assess: Step 3" with warning color for candidate with incomplete final (third) step', () => {
        let chip = getCandidateStatusChip(
          candidateHoldOnMiddleStepAndNoResultsOnFinalStep,
          intl,
        );
        expect(chip.label).toBe("To assess: Step 3");
        expect(chip.color).toBe("warning");

        chip = getCandidateStatusChip(candidateUnfinishedFinalAssessment, intl);
        expect(chip.label).toBe("To assess: Step 3");
        expect(chip.color).toBe("warning");
      });
      it('should return "Disqualified: Pending decision" with error color for candidate with any one unsuccessful step', () => {
        const chip = getCandidateStatusChip(
          candidateOneFailingAssessment,
          intl,
        );
        expect(chip.label).toBe("Disqualified: Pending decision");
        expect(chip.color).toBe("error");
      });
    });
  });
});
