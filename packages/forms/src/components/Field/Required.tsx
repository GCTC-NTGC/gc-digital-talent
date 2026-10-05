import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

export interface RequiredProps {
  required?: boolean;
}

const Required = ({ required }: RequiredProps) => {
  const intl = useIntl();
  return required ? (
    <span className="ml-1 text-error-500 dark:text-error-300">
      {intl.formatMessage(uiMessages.asterisk)}
    </span>
  ) : null;
};

export default Required;
