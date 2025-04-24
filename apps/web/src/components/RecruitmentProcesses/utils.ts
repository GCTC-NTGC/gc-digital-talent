import { IntlShape } from "react-intl";

import { Maybe } from "@gc-digital-talent/graphql";

export const recruitmentProcessesTitle = (
  numOfProcesses: Maybe<number>,
  intl: IntlShape,
) => {
  return intl.formatMessage(
    {
      defaultMessage: "Recruitment processes ({numOfProcesses})",
      id: "wMni5o",
      description: "Recruitment processes expandable",
    },
    {
      numOfProcesses: numOfProcesses ?? 0,
    },
  );
};
