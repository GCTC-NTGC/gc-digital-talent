import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Well } from "@gc-digital-talent/ui";

interface NullDisplayProps {
  title?: ReactNode;
  content?: ReactNode;
  optional?: boolean;
}

const NullDisplay = ({ title, content, optional }: NullDisplayProps) => {
  const intl = useIntl();
  return (
    <Well className="text-center">
      {title ? (
        <p className="mb-3 font-bold">{title}</p>
      ) : (
        <p className="mb-3 font-bold">
          {optional
            ? intl.formatMessage({
                defaultMessage: "This information is optional.",
                id: "xm2o/k",
                description: "Null message on sections for edit pool page.",
              })
            : intl.formatMessage({
                defaultMessage: "You haven't filled out this information yet.",
                id: "D3so/C",
                description: "Null message on sections for edit pool page.",
              })}
        </p>
      )}
      <p className="font-normal">
        {content ??
          intl.formatMessage({
            defaultMessage: `Use the "Edit" button to get started.`,
            id: "2m5USi",
            description: "Null message on sections for edit pool page.",
          })}
      </p>
    </Well>
  );
};

export default NullDisplay;
