/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { createIntl, createIntlCache } from "react-intl";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import {
  CitizenshipStatus,
  ClaimVerificationResult,
  FinalDecision,
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
      [
        FinalDecision.Qualified,
        FinalDecision.QualifiedPlaced,
        FinalDecision.QualifiedPending,
      ].forEach((finalDecision) => {
        const { label, color } = getCandidateStatusChip(
          {
            value: finalDecision,
            label: { en: "Qualified" },
          },
          candidate.assessmentStep?.sortOrder,
          candidate.assessmentStatus,
          intl,
        );
        expect(label).toBe("Qualified");
        expect(color).toBe("success");
      });
    });

    it('should return "Disqualified" in error color for non-removed SCREENED OUT statuses', () => {
      [FinalDecision.Disqualified, FinalDecision.DisqualifiedPending].forEach(
        (finalDecision) => {
          const { label, color } = getCandidateStatusChip(
            {
              value: finalDecision,
              label: { en: "Disqualified" },
            },
            candidate.assessmentStep?.sortOrder,
            candidate.assessmentStatus,
            intl,
          );
          expect(label).toBe("Disqualified");
          expect(color).toBe("error");
        },
      );
    });

    it('should return "Removed" in black color for removed statuses, along with reason for removal', () => {
      let chip = getCandidateStatusChip(
        {
          value: FinalDecision.ToAssessRemoved,
          label: {
            en: "Removed: To assess",
          },
        },
        candidate.assessmentStep?.sortOrder,
        candidate.assessmentStatus,
        intl,
      );
      expect(chip.label).toBe("Removed: To assess");
      expect(chip.color).toBe("black");

      chip = getCandidateStatusChip(
        {
          value: FinalDecision.QualifiedRemoved,
          label: {
            en: "Removed: Qualified",
          },
        },
        candidate.assessmentStep?.sortOrder,
        candidate.assessmentStatus,
        intl,
      );
      expect(chip.label).toBe("Removed: Qualified");
      expect(chip.color).toBe("black");
      expect(chip.color).toBe("black");

      chip = getCandidateStatusChip(
        {
          value: FinalDecision.Removed,
          label: {
            en: "Removed",
          },
        },
        candidate.assessmentStep?.sortOrder,
        candidate.assessmentStatus,
        intl,
      );
      expect(chip.label).toBe("Removed"); // This status was only for legacy candidates, and its hard to interpret exact reason
      expect(chip.color).toBe("black");

      chip = getCandidateStatusChip(
        {
          value: FinalDecision.QualifiedExpired,
          label: {
            en: "Expired: Qualified",
          },
        },
        candidate.assessmentStep?.sortOrder,
        candidate.assessmentStatus,
        intl,
      );
      expect(chip.label).toBe("Expired: Qualified"); // Okay technically this one doesn't say Removed
      expect(chip.color).toBe("black");
    });
    describe("Candidates in assessment", () => {
      it('should return "Qualified: Pending decision" and success color for candidates with an assessment status who have passed all AssessmentSteps', () => {
        const chip = getCandidateStatusChip(
          {
            value: FinalDecision.QualifiedPending,
            label: {
              en: "Qualified: Pending decision",
            },
          },
          candidateFullyQualified.assessmentStep?.sortOrder,
          candidateFullyQualified.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("Qualified: Pending decision");
        expect(chip.color).toBe("success");
      });
      it('should return "Qualified: Pending decision" and success color for candidates with a Hold status on a middle step, and qualified otherwise', () => {
        const chip = getCandidateStatusChip(
          {
            value: FinalDecision.QualifiedPending,
            label: {
              en: "Qualified: Pending decision",
            },
          },
          candidateQualifiedExceptHoldOnMiddleAssessment.assessmentStep
            ?.sortOrder,
          candidateQualifiedExceptHoldOnMiddleAssessment.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("Qualified: Pending decision");
        expect(chip.color).toBe("success");
      });
      it('should return "To assess" with warning color for candidates missing education assessment', () => {
        const chip = getCandidateStatusChip(
          {
            value: FinalDecision.ToAssess,
            label: { en: "To assess" },
          },
          candidateFullyQualifiedExceptMissingEducation.assessmentStep
            ?.sortOrder,
          candidateFullyQualifiedExceptMissingEducation.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("To assess");
        expect(chip.color).toBe("warning");
      });
      it('should return "To assess" with warning color for candidates with no assessments', () => {
        const chip = getCandidateStatusChip(
          {
            value: FinalDecision.ToAssess,
            label: { en: "To assess" },
          },

          candidateNoAssessments.assessmentStep?.sortOrder,
          candidateNoAssessments.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("To assess");
        expect(chip.color).toBe("warning");
      });
      it('should return "To assess" with warning color for candidate qualified except for hold on final (third) step', () => {
        const chip = getCandidateStatusChip(
          {
            value: FinalDecision.ToAssess,
            label: { en: "To assess" },
          },
          candidateQualifiedExceptHoldOnFinalAssessment.assessmentStep
            ?.sortOrder,
          candidateQualifiedExceptHoldOnFinalAssessment.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("To assess");
        expect(chip.color).toBe("warning");
      });
      it('should return "To assess" with warning color for candidate with incomplete final (third) step', () => {
        let chip = getCandidateStatusChip(
          {
            value: FinalDecision.ToAssess,
            label: { en: "To assess" },
          },
          candidateHoldOnMiddleStepAndNoResultsOnFinalStep.assessmentStep
            ?.sortOrder,
          candidateHoldOnMiddleStepAndNoResultsOnFinalStep.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("To assess");
        expect(chip.color).toBe("warning");

        chip = getCandidateStatusChip(
          {
            value: FinalDecision.ToAssess,
            label: { en: "To assess" },
          },
          candidateUnfinishedFinalAssessment.assessmentStep?.sortOrder,
          candidateUnfinishedFinalAssessment.assessmentStatus,
          intl,
        );
        expect(chip.label).toBe("To assess");
        expect(chip.color).toBe("warning");
      });
      it('should return "Disqualified: Pending decision" with error color for candidate with any one unsuccessful step', () => {
        const chip = getCandidateStatusChip(
          {
            value: FinalDecision.DisqualifiedPending,
            label: { en: "Disqualified: Pending decision" },
          },
          candidateOneFailingAssessment.assessmentStep?.sortOrder,
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
