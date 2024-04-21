import React from "react";
import { useIntl } from "react-intl";

import { Well } from "@gc-digital-talent/ui";

type NullDisplayProps = {
  title?: React.ReactNode;
  content?: React.ReactNode;
  optional?: boolean;
};

const NullDisplay = ({ title, content, optional }: NullDisplayProps) => {
  const intl = useIntl();
  return (
    <Well className="flex flex-col items-center gap-y-3 p-6">
      {title ? (
        <p className="font-bold">{title}</p>
      ) : (
        <p className="font-bold">
          {optional
            ? intl.formatMessage({
                defaultMessage: "This information is optional.",
                id: "xm2o/k",
                description: "Null message on sections for edit pool page.",
              })
            : intl.formatMessage({
                defaultMessage: "You haven't filled this information out yet.",
                id: "xsIcls",
                description: "Null message on sections for edit pool page.",
              })}
        </p>
      )}
      <p className="text-center font-normal">
        {content ||
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
