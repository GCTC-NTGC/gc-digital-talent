/* eslint-disable import/prefer-default-export */
import { Applicant } from "@gc-digital-talent/graphql";

type PartialApplicant = Pick<Applicant, "experiences">;

export function isIncomplete({ experiences }: PartialApplicant): boolean {
  return !experiences?.length;
}
