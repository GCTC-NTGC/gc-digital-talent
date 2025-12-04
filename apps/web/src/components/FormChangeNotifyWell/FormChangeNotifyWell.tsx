import { useIntl } from "react-intl";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { HeadingLevel, Notice } from "@gc-digital-talent/ui";

interface FormChangeNotifyNoticeProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> {
  headingAs?: HeadingLevel;
}

const FormChangeNotifyWell = ({
  headingAs = "h3",
  ...rest
}: FormChangeNotifyNoticeProps) => {
  const intl = useIntl();

  return (
    <Notice.Root {...rest} color="warning">
      <Notice.Title as={headingAs}>
        {intl.formatMessage(commonMessages.important)}
      </Notice.Title>
      <Notice.Content>
        <p>{intl.formatMessage(formMessages.candidateNotify)}</p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default FormChangeNotifyWell;
