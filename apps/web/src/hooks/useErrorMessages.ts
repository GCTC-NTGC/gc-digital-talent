import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { useRouteError } from "react-router-dom";

import { errorMessages } from "@gc-digital-talent/i18n";

interface ErrorMessage {
  title: ReactNode;
  body: ReactNode;
}
interface ErrorResponse {
  response: Response;
  messages: ErrorMessage;
}

const useErrorMessages = (): ErrorResponse => {
  const error = useRouteError() as Response;
  const intl = useIntl();
  const messages: Record<number, Omit<ErrorMessage, "error">> = {
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
        defaultMessage:
          "Sorry, eh! We can't find the page you were looking for.",
        id: "yExs/j",
        description: "Title for the 404 page not found page.",
      }),
      body: intl.formatMessage({
        defaultMessage:
          "It looks like you've landed on a page that either doesn't exist or has moved.",
        id: "Q6ws0E",
        description: "Body text for the 404 page not found page.",
      }),
    },
  };

  if (error && "status" in error) {
    if (error.status in messages) {
      return {
        response: error,
        messages: {
          ...messages[error.status],
        },
      };
    }
  }

  return {
    response: error,
    messages: {
      title: intl.formatMessage(errorMessages.unknownErrorRequestErrorTitle),
      body: intl.formatMessage(errorMessages.unknownErrorRequestErrorBody),
    },
  };
};

export default useErrorMessages;
