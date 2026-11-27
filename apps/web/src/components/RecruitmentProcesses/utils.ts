import { defineMessage } from "react-intl";

export const recruitmentProcessesTitle = defineMessage<{
  numOfProcesses: number;
}>({
  defaultMessage: "Recruitment processes ({numOfProcesses})",
  id: "wMni5o",
  description: "Recruitment processes expandable",
});
