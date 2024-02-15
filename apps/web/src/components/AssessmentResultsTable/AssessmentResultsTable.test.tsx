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
  interviewGroupStep,
  interviewGroupResults,
  referenceCheckStep,
  referenceCheckResults,
  screeningQuestionsStep,
  screeningQuestionsResults,
} from "./testData";
import { columnStatus } from "./utils";

describe("AssessmentResults", () => {
  it("should compute the column status correctly", async () => {
    const toAssessStep = applicationScreeningStep;
    const toAssessResults = applicationScreeningResults;

    expect(columnStatus(toAssessStep, toAssessResults)).toEqual({
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
