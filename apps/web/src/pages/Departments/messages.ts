import { defineMessage } from "react-intl";

export const labels = {
  nameEn: defineMessage({
    defaultMessage: "Department name (English)",
    id: "nZgmOO",
    description: "Label for department name in English",
  }),
  nameFr: defineMessage({
    defaultMessage: "Department name (French)",
    id: "8q2dPO",
    description: "Label for department name in French",
  }),
  departmentNumber: defineMessage({
    defaultMessage: "Department number",
    id: "66kU6k",
    description: "Label for department number",
  }),
} as const;
