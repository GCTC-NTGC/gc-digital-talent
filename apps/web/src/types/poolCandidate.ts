import { IntlShape } from "react-intl";

import { PoolCandidate } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import { PageNavInfo } from "./pages";

type GetApplicationPageInfoArgs = {
  application: Omit<PoolCandidate, "pool">;
  paths: ReturnType<typeof useRoutes>;
  intl: IntlShape;
};

export type GetApplicationPageInfo = (
  args: GetApplicationPageInfoArgs,
) => PageNavInfo;
