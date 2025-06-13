import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";

export interface NullMessageProps {
  editable?: boolean;
  type: "top" | "improve";
  editLink?: {
    label: string;
    href: string;
  };
}

const NullMessage = ({ type, editable, editLink }: NullMessageProps) => {
  const intl = useIntl();

  return (
    <Well className="text-center">
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
          {type === "improve"
            ? intl.formatMessage({
                defaultMessage:
                  "This user has not selected any skills for improvement.",
                id: "Ifl7BO",
                description:
                  "Message displayed when a user has not added any skills for improvement",
              })
            : intl.formatMessage({
                defaultMessage: "This user has not highlighted any skills.",
                id: "iMJCf8",
                description:
                  "Message displayed when a user has no top skills in their showcase",
              })}
        </p>
      )}
    </Well>
  );
};

export default NullMessage;
