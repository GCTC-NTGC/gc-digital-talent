/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { createIntl, createIntlCache } from "react-intl";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import {
  CitizenshipStatus,
  ClaimVerificationResult,
  PoolCandidateStatus,
} from "@gc-digital-talent/graphql";

import {
  getCandidateStatusChip,
  priorityWeightAfterVerification,
} from "./poolCandidate";
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
        const { label, color } = getCandidateStatusChip(
          status,
          candidate.assessmentStatus,
          intl,
        );
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
        const { label, color } = getCandidateStatusChip(
          status,
          candidate.assessmentStatus,
          intl,
        );
        expect(label).toBe("Disqualified");
        expect(color).toBe("error");
      });
    });

    it('should return "Removed" in black color for removed statuses, along with reason for removal', () => {
      let chip = getCandidateStatusChip(
        PoolCandidateStatus.ScreenedOutNotInterested,
        candidate.assessmentStatus,
        intl,
      );
      expect(chip.label).toBe("Removed: To assess");
      expect(chip.color).toBe("black");

      chip = getCandidateStatusChip(
        PoolCandidateStatus.ScreenedOutNotResponsive,
        candidate.assessmentStatus,
        intl,
      );
      expect(chip.label).toBe("Removed: To assess");
      expect(chip.color).toBe("black");

      chip = getCandidateStatusChip(
        PoolCandidateStatus.QualifiedUnavailable,
        candidate.assessmentStatus,
        intl,
      );
      expect(chip.label).toBe("Removed: Qualified");
      expect(chip.color).toBe("black");
      expect(chip.color).toBe("black");

      chip = getCandidateStatusChip(
        PoolCandidateStatus.Removed,
        candidate.assessmentStatus,
        intl,
      );
      expect(chip.label).toBe("Removed"); // This status was only for legacy candidates, and its hard to interpret exact reason
      expect(chip.color).toBe("black");

      chip = getCandidateStatusChip(
        PoolCandidateStatus.Expired,
        candidate.assessmentStatus,
        intl,
      );
      expect(chip.label).toBe("Expired: Qualified"); // Okay technically this one doesn't say Removed
      expect(chip.color).toBe("black");
    });
    describe("Candidates in assessment", () => {
      it('should return "Qualified: Pending decision" and success color for candidates with an assessment status who have passed all AssessmentSteps', () => {
        const chip = getCandidateStatusChip(
          candidateFullyQualified.status?.value,
          candidateFullyQualified.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("Qualified: Pending decision");
        expect(chip.color).toBe("success");
      });
      it('should return "Qualified: Pending decision" and success color for candidates with a Hold status on a middle step, and qualified otherwise', () => {
        const chip = getCandidateStatusChip(
          candidateQualifiedExceptHoldOnMiddleAssessment.status?.value,
          candidateQualifiedExceptHoldOnMiddleAssessment.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("Qualified: Pending decision");
        expect(chip.color).toBe("success");
      });
      it('should return "To assess: Step 1" with warning color for candidates missing education assessment', () => {
        const chip = getCandidateStatusChip(
          candidateFullyQualifiedExceptMissingEducation.status?.value,
          candidateFullyQualifiedExceptMissingEducation.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("To assess: Step 1");
        expect(chip.color).toBe("warning");
      });
      it('should return "To assess: Step 1" with warning color for candidates with no assessments', () => {
        const chip = getCandidateStatusChip(
          candidateNoAssessments.status?.value,
          candidateNoAssessments.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("To assess: Step 1");
        expect(chip.color).toBe("warning");
      });
      it('should return "To assess: Step 3" with warning color for candidate qualified except for hold on final (third) step', () => {
        const chip = getCandidateStatusChip(
          candidateQualifiedExceptHoldOnFinalAssessment.status?.value,
          candidateQualifiedExceptHoldOnFinalAssessment.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("To assess: Step 3");
        expect(chip.color).toBe("warning");
      });
      it('should return "To assess: Step 3" with warning color for candidate with incomplete final (third) step', () => {
        let chip = getCandidateStatusChip(
          candidateHoldOnMiddleStepAndNoResultsOnFinalStep.status?.value,
          candidateHoldOnMiddleStepAndNoResultsOnFinalStep.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("To assess: Step 3");
        expect(chip.color).toBe("warning");

        chip = getCandidateStatusChip(
          candidateUnfinishedFinalAssessment.status?.value,
          candidateUnfinishedFinalAssessment.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("To assess: Step 3");
        expect(chip.color).toBe("warning");
      });
      it('should return "Disqualified: Pending decision" with error color for candidate with any one unsuccessful step', () => {
        const chip = getCandidateStatusChip(
          candidateOneFailingAssessment.status?.value,
          candidateOneFailingAssessment.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("Disqualified: Pending decision");
        expect(chip.color).toBe("error");
      });
    });

    describe("Test priorityWeightAfterVerification()", () => {
      it("should return the correct weight", () => {
        const acceptedPriorityAndAcceptedVeteran =
          priorityWeightAfterVerification(
            10,
            ClaimVerificationResult.Accepted,
            ClaimVerificationResult.Accepted,
            CitizenshipStatus.Citizen,
          );
        expect(acceptedPriorityAndAcceptedVeteran).toEqual(10);

        const failedPriorityAndAcceptedVeteran =
          priorityWeightAfterVerification(
            10,
            ClaimVerificationResult.Rejected,
            ClaimVerificationResult.Accepted,
            CitizenshipStatus.Citizen,
          );
        expect(failedPriorityAndAcceptedVeteran).toEqual(20);

        const failedPriorityAndFailedVeteran = priorityWeightAfterVerification(
          10,
          ClaimVerificationResult.Rejected,
          ClaimVerificationResult.Rejected,
          CitizenshipStatus.Citizen,
        );
        expect(failedPriorityAndFailedVeteran).toEqual(30);

        const onlyAResident = priorityWeightAfterVerification(
          30,
          null,
          null,
          CitizenshipStatus.PermanentResident,
        );
        expect(onlyAResident).toEqual(30);

        const failedPriorityOther = priorityWeightAfterVerification(
          10,
          ClaimVerificationResult.Rejected,
          null,
          CitizenshipStatus.Other,
        );
        expect(failedPriorityOther).toEqual(40);

        const failedPriorityFailedVeteranOther =
          priorityWeightAfterVerification(
            10,
            ClaimVerificationResult.Rejected,
            ClaimVerificationResult.Rejected,
            CitizenshipStatus.Other,
          );
        expect(failedPriorityFailedVeteranOther).toEqual(40);

        const priorityClaimButAllNull = priorityWeightAfterVerification(
          10,
          null,
          null,
          null,
        );
        expect(priorityClaimButAllNull).toEqual(40);
      });
    });
  });
});
