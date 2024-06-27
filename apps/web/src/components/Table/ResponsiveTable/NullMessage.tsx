import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Heading, Well } from "@gc-digital-talent/ui";

import tableMessages from "../tableMessages";

export interface NullMessageProps {
  /** Heading for the message */
  title?: ReactNode;
  /** Main body of the message */
  description?: ReactNode;
}

/**
 * Null Message
 *
 * Displayed when there are no rows in the table
 *
 * @param NullMessageProps
 * @returns JSX.Element
 */
const NullMessage = ({ title, description }: NullMessageProps) => {
  const intl = useIntl();

  return (
    <Well data-h2-margin="base(x1 0)" data-h2-text-align="base(center)">
      <Heading data-h2-margin="base(0)" data-h2-font-size="base(copy)">
        {title || intl.formatMessage(tableMessages.noItemsTitle)}
      </Heading>
      {description && <p data-h2-margin-top="base(x1)">{description}</p>}
    </Well>
  );
};

export default NullMessage;
