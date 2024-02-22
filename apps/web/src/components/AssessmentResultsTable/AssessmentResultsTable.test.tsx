/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";

import {
  applicationScreeningStep,
  applicationScreeningResults,
  screeningQuestionsStep,
  screeningQuestionsResults,
  referenceCheckStep,
  referenceCheckResults,
  interviewGroupStep,
  interviewGroupResults,
} from "./testData";
import { columnStatus } from "./utils";

describe("AssessmentResults", () => {
  it("should compute the column status correctly", async () => {
    const notSureStep = applicationScreeningStep;
    const notSureResult = applicationScreeningResults;

    expect(columnStatus(notSureStep, notSureResult)).toEqual({
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
    const errorResults = screeningQuestionsResults;

    expect(columnStatus(errorStep, errorResults)).toEqual({
      icon: XCircleIcon,
      color: "error",
    });

    const holdStep = referenceCheckStep;
    const holdResults = referenceCheckResults;

    expect(columnStatus(holdStep, holdResults)).toEqual({
      icon: PauseCircleIcon,
      color: "hold",
    });

    const successStep = interviewGroupStep;
    const successResults = interviewGroupResults;

    expect(columnStatus(successStep, successResults)).toEqual({
      icon: CheckCircleIcon,
      color: "success",
    });
  });
});
