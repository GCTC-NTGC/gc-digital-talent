import { defineMessages, type MessageDescriptor } from "react-intl";

export const classificationLabels: Record<string, MessageDescriptor> =
  defineMessages({
    "IT-01": {
      defaultMessage: "IT-01: Technician ($60,000 to $78,000)",
      id: "ZuyuPO",
      description: "IT-01 classification label including titles and salaries",
    },
    "IT-02": {
      defaultMessage: "IT-02: Analyst ($75,000 to $91,000)",
      id: "UN2Ncr",
      description: "IT-02 classification label including titles and salaries",
    },
    "IT-03": {
      defaultMessage:
        "IT-03: Technical Advisor or Team Leader ($88,000 to $110,000)",
      id: "Aa8SIB",
      description: "IT-03 classification label including titles and salaries",
    },
    "IT-04": {
      defaultMessage: "IT-04: Senior Advisor or Manager ($101,000 to $126,000)",
      id: "5YzNJj",
      description: "IT-04 classification label including titles and salaries",
    },
  });

export const classificationAriaLabels: Record<string, MessageDescriptor> =
  defineMessages({
    "IT-01": {
      defaultMessage: "Technician I T 1 ($60,000 to $78,000)",
      id: "1c+inU",
      description:
        "IT-01 classification aria label including titles and salaries",
    },
    "IT-02": {
      defaultMessage: "Analyst I T 2 ($75,000 to $91,000)",
      id: "BkHx2X",
      description:
        "IT-02 classification aria label including titles and salaries",
    },
    "IT-03": {
      defaultMessage:
        "Technical Advisor or Team Leader I T 3 ($88,000 to $110,000)",
      id: "++WV3O",
      description:
        "IT-03 classification aria label including titles and salaries",
    },
    "IT-04": {
      defaultMessage: "Senior Advisor or Manager I T 4 ($101,000 to $126,000)",
      id: "Ix0KgU",
      description:
        "IT-04 classification aria label including titles and salaries",
    },
  });
