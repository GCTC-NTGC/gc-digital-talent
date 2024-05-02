import * as React from "react";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";

const Important = ({ ...rest }) => {
  const intl = useIntl();

  return (
    <Well
      color="warning"
      fontSize="caption"
      data-h2-display="base(grid)"
      data-h2-gap="base(x.5)"
      data-h2-padding="base(x.5)"
      {...rest}
    >
      <p data-h2-font-weight="base(bold)">
        {intl.formatMessage({
          defaultMessage: "Important",
          id: "IKGhHj",
          description: "Important note or caption",
        })}
      </p>
      <p data-h2-font-size="base(caption)">
        {intl.formatMessage({
          defaultMessage:
            "The candidate will be notified of any changes made in this form.",
          id: "17dZD4",
          description:
            "Caption notifying the user about who can know about the results of form changes",
        })}
      </p>
    </Well>
  );
};

export default Important;
