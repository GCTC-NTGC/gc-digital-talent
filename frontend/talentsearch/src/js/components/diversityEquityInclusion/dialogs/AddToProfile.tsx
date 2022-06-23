import React from "react";
import { useIntl } from "react-intl";

const AddToProfile: React.FC = () => {
  const intl = useIntl();

  return (
    <p>
      {intl.formatMessage({
        defaultMessage:
          "Based on this definition, I want to add the following to my profile:",
        description: "Text that appears before employment equity form options.",
      })}
    </p>
  );
};

export default AddToProfile;
