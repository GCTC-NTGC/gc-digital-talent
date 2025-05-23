import { useIntl } from "react-intl";

import { ChipProps } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

interface MetaDataTalentNominationChipProps {
  submittedAt: string | null | undefined;
}

interface TalentNominationChip {
  label: string;
  color: ChipProps["color"];
}

export const useMetaDataTalentNominationChip = ({
  submittedAt,
}: MetaDataTalentNominationChipProps): TalentNominationChip => {
  const intl = useIntl();

  return submittedAt
    ? { label: intl.formatMessage(commonMessages.received), color: "secondary" }
    : { label: intl.formatMessage(commonMessages.draft), color: "primary" };
};
