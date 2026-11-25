import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import type { ChipProps } from "@gc-digital-talent/ui";

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
    : {
        label: intl.formatMessage({
          defaultMessage: "Draft",
          id: "fRyPvR",
          description: "Item's state is draft",
        }),
        color: "primary",
      };
};
