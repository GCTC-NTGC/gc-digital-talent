import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Notice } from "@gc-digital-talent/ui";

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
    <Notice.Root className="my-6 text-center">
      <Notice.Title as="h2">
        {title ?? intl.formatMessage(tableMessages.noItemsTitle)}
      </Notice.Title>
      {description && (
        <Notice.Content>
          <p className="mt-6">{description}</p>
        </Notice.Content>
      )}
    </Notice.Root>
  );
};

export default NullMessage;
