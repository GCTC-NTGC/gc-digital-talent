import { useIntl } from "react-intl";
import { useRouteError } from "react-router-dom";

import { errorMessages } from "@common/messages";

interface ErrorResponse {
  status: number;
  statusText: string;
}

interface ErrorMessage {
  title: React.ReactNode;
  body: React.ReactNode;
}

const useErrorMessages = (): ErrorMessage => {
  const error = useRouteError() as ErrorResponse;
  const intl = useIntl();
  const messages: Record<number, ErrorMessage> = {
    401: {
      title: intl.formatMessage({
        description:
          "Heading for the message saying the page to view is not authorized.",
        defaultMessage: "Sorry, you are not authorized to view this page.",
        id: "jPLaDk",
      }),
      body: intl.formatMessage({
        description:
          "Detailed message saying the page to view is not authorized.",
        defaultMessage:
          "Oops, it looks like you've landed on a page that you are not authorized to view.",
        id: "gKyog2",
      }),
    },
    404: {
      title: intl.formatMessage({
        description: "Heading for the message saying the page was not found.",
        defaultMessage: "Sorry, we can't find the page you were looking for.",
        id: "pBJzgi",
      }),
      body: intl.formatMessage({
        description: "Detailed message saying the page was not found.",
        defaultMessage:
          "Oops, it looks like you've landed on a page that either doesn't exist or has moved.",
        id: "pgHTkX",
      }),
    },
  };

  if ("status" in error) {
    if (error.status in messages) return messages[error.status];
  }

  return {
    title: intl.formatMessage(errorMessages.unknownErrorRequestErrorTitle),
    body: intl.formatMessage(errorMessages.unknownErrorRequestErrorBody),
  };
};

export default useErrorMessages;
