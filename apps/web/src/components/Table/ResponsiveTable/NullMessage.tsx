import React from "react";
import { useIntl } from "react-intl";

import { Heading, Well } from "@gc-digital-talent/ui";

export interface NullMessageProps {
  /** Heading for the message */
  title?: React.ReactNode;
  /** Main body of the message */
  description?: React.ReactNode;
}

/**
 * Null Message
 *
 * Displayed when there are no rows in the table
 *
 * @param NullMessageProps
 * @returns React.JSX.Element
 */
const NullMessage = ({ title, description }: NullMessageProps) => {
  const intl = useIntl();

  return (
    <Well data-h2-margin="base(x1 0)" data-h2-text-align="base(center)">
      <Heading data-h2-margin-top="base(0)" data-h2-font-size="base(copy)">
        {title ||
          intl.formatMessage({
            defaultMessage: "There aren't any items here yet.",
            id: "H5kSPB",
            description: "Default message for an empty table",
          })}
      </Heading>
      <p>
        {description ||
          intl.formatMessage({
            defaultMessage:
              'Get started by adding an item using the "Add a new item" button provided.',
            id: "/GIL9l",
            description: "Default description for an empty table",
          })}
      </p>
    </Well>
  );
};

export default NullMessage;
