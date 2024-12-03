import { ReactNode } from "react";
import { defineMessages, useIntl } from "react-intl";
import { isRouteErrorResponse, useRouteError } from "react-router";

import { errorMessages } from "@gc-digital-talent/i18n";

interface DataError {
  message?: string;
}

interface ErrorMessage {
  title: ReactNode;
  body: ReactNode;
}

interface ErrorWithMessages {
  error: Error;
  messages: ErrorMessage;
}

export const routeErrorMessages = defineMessages({
  unauthorizedTitle: {
    description:
      "Heading for the message saying the page to view is not authorized.",
    defaultMessage: "Sorry, you are not authorized to view this page.",
    id: "jPLaDk",
  },
  unauthorizedBody: {
    description: "Detailed message saying the page to view is not authorized.",
    defaultMessage:
      "Oops, it looks like you've landed on a page that you are not authorized to view.",
    id: "gKyog2",
  },
  notFoundTitle: {
    defaultMessage: "Sorry, eh! We can't find the page you were looking for.",
    id: "yExs/j",
    description: "Title for the 404 page not found page.",
  },
  notFoundBody: {
    defaultMessage:
      "It looks like you've landed on a page that either doesn't exist or has moved.",
    id: "Q6ws0E",
    description: "Body text for the 404 page not found page.",
  },
});

const errorStatusMap: Record<string, number> = {
  UnauthorizedError: 401,
  NotFoundError: 404,
};

const useErrorMessages = (): ErrorWithMessages => {
  const error = useRouteError();
  const intl = useIntl();
  const knownErrorMessages: Record<number, Omit<ErrorMessage, "error">> = {
    [401]: {
      title: intl.formatMessage(routeErrorMessages.unauthorizedTitle),
      body: intl.formatMessage(routeErrorMessages.unauthorizedBody),
    },
    [404]: {
      title: intl.formatMessage(routeErrorMessages.notFoundTitle),
      body: intl.formatMessage(routeErrorMessages.notFoundBody),
    },
  };

  if (isRouteErrorResponse(error) && "status" in error) {
    const data = error.data as DataError;
    return {
      error: new Error(data?.message ? String(data.message) : "Unknown error"),
      messages: knownErrorMessages[error.status],
    };
  }

  if (error instanceof Error) {
    if (error && "name" in error) {
      if (error.name in errorStatusMap) {
        return {
          error,
          messages: knownErrorMessages[errorStatusMap[error.name]],
        };
      }
    }
  }

  return {
    error: new Error(),
    messages: {
      title: intl.formatMessage(errorMessages.unknownErrorRequestErrorTitle),
      body: intl.formatMessage(errorMessages.unknownErrorRequestErrorBody),
    },
  };
};

export default useErrorMessages;
