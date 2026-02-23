import { useIntl } from "react-intl";

import { Notice } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

const StatusChangeNotice = () => {
  const intl = useIntl();
  return (
    <Notice.Root mode="inline" color="warning" small>
      <Notice.Title>
        {intl.formatMessage(commonMessages.important)}
      </Notice.Title>
      <Notice.Content>
        <p>{intl.formatMessage(formMessages.candidateNotify)}</p>
      </Notice.Content>
    </Notice.Root>
  );
};

export default StatusChangeNotice;
