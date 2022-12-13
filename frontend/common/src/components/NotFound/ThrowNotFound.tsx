import { useIntl } from "react-intl";

import { commonMessages } from "../../messages";

export interface ThrowNotFoundProps {
  message?: string;
}

const ThrowNotFound = ({ message }: ThrowNotFoundProps) => {
  const intl = useIntl();

  throw new Response("", {
    status: 404,
    statusText: message || intl.formatMessage(commonMessages.notFound),
  });
};

export default ThrowNotFound;
