import { useIntl } from "react-intl";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Heading, HeadingLevel, Well } from "@gc-digital-talent/ui";

interface FormChangeNotifyWellProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  headingAs?: HeadingLevel;
}

const FormChangeNotifyWell = ({
  headingAs = "h3",
  ...rest
}: FormChangeNotifyWellProps) => {
  const intl = useIntl();

  return (
    <Well {...rest} color="warning" fontSize="caption">
      <Heading level={headingAs} size="h6" className="mt-0">
        {intl.formatMessage(commonMessages.important)}
      </Heading>
      <p>{intl.formatMessage(formMessages.candidateNotify)}</p>
    </Well>
  );
};

export default FormChangeNotifyWell;
