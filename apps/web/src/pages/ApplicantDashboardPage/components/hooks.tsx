import { useIntl } from "react-intl";
import { useCallback, useState } from "react";

import type { ChipProps } from "@gc-digital-talent/ui";
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

export const useNodeFocus: () => [
  focus: (() => void) | undefined,
  ref: (node: HTMLElement | null) => void,
] = () => {
  const [focus, setFocus] = useState<HTMLOrSVGElement["focus"]>();
  const ref = useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setFocus(() => node.focus.bind(node));
    }
  }, []);
  return [focus, ref];
};
