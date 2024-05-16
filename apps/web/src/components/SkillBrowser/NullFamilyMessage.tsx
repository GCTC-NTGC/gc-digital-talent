import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";

const NullFamilyMessage = () => {
  const intl = useIntl();

  return (
    <Well>
      <p data-h2-text-align="base(center)">
        {intl.formatMessage({
          id: "5CIYu4",
          defaultMessage: "Please select a skill family to continue.",
          description:
            "Help text to tell users to select a skill before submitting",
        })}
      </p>
    </Well>
  );
};

export default NullFamilyMessage;
