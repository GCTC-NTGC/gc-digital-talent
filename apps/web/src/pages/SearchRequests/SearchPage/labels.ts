import { defineMessages, type MessageDescriptor } from "react-intl";

export const classificationLabels: Record<string, MessageDescriptor> =
  defineMessages({
    "IT-01": {
      defaultMessage: "IT-01: Technician",
      id: "Fe9Cje",
      description: "IT-01 classification label including titles",
    },
    "IT-02": {
      defaultMessage: "IT-02: Analyst",
      id: "WsR0FB",
      description: "IT-02 classification label including titles",
    },
    "IT-03": {
      defaultMessage: "IT-03: Technical Advisor or Team Leader",
      id: "RHTrvR",
      description: "IT-03 classification label including titles",
    },
    "IT-04": {
      defaultMessage: "IT-04: Senior Advisor or Manager",
      id: "eIxShU",
      description: "IT-04 classification label including titles",
    },
  });

export const classificationAriaLabels: Record<string, MessageDescriptor> =
  defineMessages({
    "IT-01": {
      defaultMessage: "Technician I T 1",
      id: "fzkrgq",
      description: "IT-01 classification aria label including titles",
    },
    "IT-02": {
      defaultMessage: "Analyst I T 2",
      id: "MCBdYy",
      description: "IT-02 classification aria label including titles",
    },
    "IT-03": {
      defaultMessage: "Technical Advisor or Team Leader I T 3",
      id: "jNqZ46",
      description: "IT-03 classification aria label including titles",
    },
    "IT-04": {
      defaultMessage: "Senior Advisor or Manager I T 4",
      id: "jAPSUd",
      description: "IT-04 classification aria label including titles",
    },
  });
