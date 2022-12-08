import React from "react";
import { useIntl } from "react-intl";

import TextArea from "../form/TextArea";

interface DetailsTextAreaProps {
  id: string;
  name: string;
  skillName: string;
}

const DetailsTextArea = ({ skillName, ...rest }: DetailsTextAreaProps) => {
  const intl = useIntl();

  return (
    <TextArea
      {...rest}
      trackUnsaved={false}
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
