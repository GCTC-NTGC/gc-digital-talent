import { defineMessages, MessageDescriptor } from "react-intl";
import { OperationalRequirement } from "@common/api/generated";
import { getOrThrowError } from "@common/helpers/util";

export const operationalRequirements = defineMessages({
  [OperationalRequirement.ShiftWork]: {
    defaultMessage: "Shift work",
    description: "The operational requirement described as shift work.",
  },
  [OperationalRequirement.OnCall]: {
    defaultMessage: "24/7 on-call",
    description: "The operational requirement described as 24/7 on-call.",
  },
  [OperationalRequirement.Travel]: {
    defaultMessage: "Travel as required",
    description: "The operational requirement described as travel as required.",
  },
  [OperationalRequirement.TransportEquipment]: {
    defaultMessage: "Transport equipment up to 20kg",
    description:
      "The operational requirement described as transport equipment up to 20kg.",
  },
  [OperationalRequirement.DriversLicense]: {
    defaultMessage: "Driver's license",
    description: "The operational requirement described as driver's license.",
  },
  [OperationalRequirement.WorkWeekends]: {
    defaultMessage: "Work weekends",
    description: "The operational requirement described as work weekends.",
  },
  [OperationalRequirement.OvertimeScheduled]: {
    defaultMessage: "Work scheduled overtime",
    description: "The operational requirement described as scheduled overtime.",
  },
  [OperationalRequirement.OvertimeShortNotice]: {
    defaultMessage: "Work overtime on short notice",
    description:
      "The operational requirement described as short notice overtime.",
  },
});

export const getOperationalRequirement = (
  operationalRequirementId: string | number,
): MessageDescriptor =>
  getOrThrowError(
    operationalRequirements,
    operationalRequirementId,
    `Invalid Operational Requirement '${operationalRequirementId}'`,
  );
