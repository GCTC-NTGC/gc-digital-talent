/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";

import { AssessmentDecision } from "@gc-digital-talent/graphql";

import {
  applicationScreeningStep,
  screeningQuestionsStep,
  referenceCheckStep,
  interviewGroupStep,
} from "./testData";
import { columnStatus } from "./utils";

describe("AssessmentResults", () => {
  it("should compute the column status correctly", async () => {
    const notSureStep = applicationScreeningStep;

    expect(
      columnStatus(notSureStep, {
        assessmentStepStatuses: [{ step: notSureStep.id, decision: null }],
      }),
    ).toEqual({
      icon: ExclamationCircleIcon,
      color: "toAssess",
    });

    const toAssessStep = applicationScreeningStep;
    const noResults = undefined;

    expect(columnStatus(toAssessStep, noResults)).toEqual({
      icon: ExclamationCircleIcon,
      color: "toAssess",
    });

    const errorStep = screeningQuestionsStep;

    expect(
      columnStatus(errorStep, {
        assessmentStepStatuses: [
          {
            step: errorStep.id,
            decision: AssessmentDecision.Unsuccessful,
          },
        ],
      }),
    ).toEqual({
      icon: XCircleIcon,
      color: "error",
    });

    const holdStep = referenceCheckStep;

    expect(
      columnStatus(holdStep, {
        assessmentStepStatuses: [
          { step: holdStep.id, decision: AssessmentDecision.Hold },
        ],
      }),
    ).toEqual({
      icon: PauseCircleIcon,
      color: "hold",
    });

    const successStep = interviewGroupStep;

    expect(
      columnStatus(successStep, {
        assessmentStepStatuses: [
          { step: successStep.id, decision: AssessmentDecision.Successful },
        ],
      }),
    ).toEqual({
      icon: CheckCircleIcon,
      color: "success",
    });
  });
});
