import { ApplicationStep } from "@gc-digital-talent/graphql";
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
  prerequisites: Array<ApplicationStep>;
};

export type GetApplicationPageInfo = (
  args: GetApplicationPageInfoArgs,
) => ApplicationPageInfo;
