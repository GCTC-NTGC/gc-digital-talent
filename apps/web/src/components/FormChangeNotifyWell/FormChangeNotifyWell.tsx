import { useIntl } from "react-intl";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { Heading, HeadingLevel, Notice } from "@gc-digital-talent/ui";

interface FormChangeNotifyNoticeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  headingAs?: HeadingLevel;
}

const FormChangeNotifyWell = ({
  headingAs = "h3",
  ...rest
}: FormChangeNotifyNoticeProps) => {
  const intl = useIntl();

  return (
    <Notice.Root {...rest} color="warning">
      <Notice.Title>
        <Heading level={headingAs} size="h6" className="mt-0">
          {intl.formatMessage(commonMessages.important)}
        </Heading>
      </Notice.Title>
      <Notice.Content>
        <p>{intl.formatMessage(formMessages.candidateNotify)}</p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default FormChangeNotifyWell;
