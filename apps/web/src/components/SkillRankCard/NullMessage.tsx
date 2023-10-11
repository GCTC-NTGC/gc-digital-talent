import React from "react";
import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";

export interface NullMessageProps {
  editable?: boolean;
  editLink?: {
    label: string;
    href: string;
  };
}

const NullMessage = ({ editable, editLink }: NullMessageProps) => {
  const intl = useIntl();

  return (
    <Well data-h2-text-align="base(center)">
      {editable && editLink ? (
        <Link
          mode="inline"
          color="black"
          block
          href={editLink.href}
          aria-label={editLink.label}
        >
          {intl.formatMessage({
            defaultMessage: "Add some skills to this list.",
            id: "dnKWUf",
            description:
              "Text displayed when no skills have been added to a ranking",
          })}
        </Link>
      ) : (
        <p>
          {intl.formatMessage({
            defaultMessage: "No skills added.",
            id: "ZkWI6J",
            description:
              "Message displayed when a user has no added skills to their showcase",
          })}
        </p>
      )}
    </Well>
  );
};

export default NullMessage;
