import React from "react";
import { useIntl } from "react-intl";

const AddToProfile: React.FC = () => {
  const intl = useIntl();

  return (
    <p data-h2-margin="base(0, 0, x.5, 0)">
      {intl.formatMessage({
        defaultMessage:
          "Based on this definition, I want to add the following to my profile:",
        description: "Text that appears before employment equity form options.",
      })}
    </p>
  );
};

export default AddToProfile;
