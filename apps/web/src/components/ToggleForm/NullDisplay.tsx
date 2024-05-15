import * as React from "react";
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
    <Well
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(x.5, 0)"
      data-h2-padding="base(x1)"
    >
      {title ? (
        <p data-h2-font-weight="base(700)">{title}</p>
      ) : (
        <p data-h2-font-weight="base(700)">
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
      <p data-h2-font-weight="base(400)" data-h2-text-align="base(center)">
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
