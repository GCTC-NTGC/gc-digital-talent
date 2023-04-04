import React from "react";
import { useIntl } from "react-intl";

import { TextArea } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

interface DetailsTextAreaProps {
  id: string;
  name: string;
  skillName: string;
  required?: boolean;
}

const DetailsTextArea = ({
  skillName,
  required = false,
  ...rest
}: DetailsTextAreaProps) => {
  const intl = useIntl();

  return (
    <TextArea
      {...rest}
      trackUnsaved={false}
      rules={{
        required: required
          ? intl.formatMessage(errorMessages.required)
          : undefined,
      }}
      label={intl.formatMessage(
        {
          defaultMessage: 'Describe how you applied "{skillName}"',
          id: "8vkTDJ",
          description:
            "Label for the text area to describe the skill experience",
        },
        { skillName },
      )}
    />
  );
};

export default DetailsTextArea;
