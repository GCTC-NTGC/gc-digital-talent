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
    <Well className="my-6 text-center">
      <Heading className="m-0 text-base lg:text-base">
        {title ?? intl.formatMessage(tableMessages.noItemsTitle)}
      </Heading>
      {description && <p className="mt-6">{description}</p>}
    </Well>
  );
};

export default NullMessage;
