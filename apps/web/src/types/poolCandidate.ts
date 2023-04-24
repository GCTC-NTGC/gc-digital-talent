import {
  Applicant,
  ApplicationStep,
  PoolAdvertisement,
} from "@gc-digital-talent/graphql";
import { IntlShape } from "react-intl";

import { PoolCandidate, Scalars } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import { PageNavInfo } from "./pages";

export type GetApplicationPageInfoArgs = {
  application: Omit<PoolCandidate, "pool">;
  paths: ReturnType<typeof useRoutes>;
  resourceId?: Scalars["ID"];
  intl: IntlShape;
};

export type ApplicationPageInfo = PageNavInfo & {
  omitFromStepper?: boolean;
  // Which application steps should be submitted before you can use this page?
  prerequisites: Array<ApplicationStep>;
  // Which application step does this page submit?
  stepSubmitted: ApplicationStep | null;
  // Is the applicant valid as far as this page is concerned?
  hasError:
    | ((applicant: Applicant, poolAdvertisement: PoolAdvertisement) => boolean)
    | null;
};

export type GetApplicationPageInfo = (
  args: GetApplicationPageInfoArgs,
) => ApplicationPageInfo;

export type ApplicationPageNavKey =
  | "welcome"
  | "profile"
  | "resume-intro"
  | "resume-add"
  | "resume-edit"
  | "resume"
  | "education"
  | "skills-intro"
  | "skills"
  | "questions-intro"
  | "questions"
  | "review"
  | "success";
