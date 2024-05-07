import React from "react";
import { useIntl } from "react-intl";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Heading, HeadingLevel, Well } from "@gc-digital-talent/ui";

interface FormChangeNotifyWellProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  headingAs?: HeadingLevel;
}

const FormChangeNotifyWell = ({
  headingAs = "h3",
  ...rest
}: FormChangeNotifyWellProps) => {
  const intl = useIntl();

  return (
    <Well {...rest} color="warning" fontSize="caption">
      <Heading level={headingAs} size="h6" data-h2-margin-top="base(0)">
        {intl.formatMessage(commonMessages.important)}
      </Heading>
      <p>{intl.formatMessage(formMessages.candidateNotify)}</p>
    </Well>
  );
};

export default FormChangeNotifyWell;
