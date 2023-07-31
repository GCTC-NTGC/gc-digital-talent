import * as React from "react";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { useIntl } from "react-intl";

import { Submit } from "@gc-digital-talent/forms";

interface SaveButtonProps {
  disabled?: boolean;
}

const SaveButton = ({ disabled }: SaveButtonProps) => {
  const intl = useIntl();
  return (
    <Submit
      color="primary"
      mode="solid"
      icon={ArrowDownOnSquareIcon}
      disabled={disabled}
      text={intl.formatMessage({
        defaultMessage: "Save and go back",
        id: "CuHYqt",
        description: "Text for save button on profile form.",
      })}
      isSubmittingText={intl.formatMessage({
        defaultMessage: "Saving...",
        id: "lai6E5",
        description: "Submitting text for save button on profile form.",
      })}
      submittedText={intl.formatMessage({
        defaultMessage: "Saved",
        id: "TV4UWm",
        description: "Submitted text for save button on profile form.",
      })}
    />
  );
};

export default SaveButton;
