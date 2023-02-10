import React from "react";
import { useIntl } from "react-intl";
import type { CombinedError } from "urql";

import { commonMessages } from "@gc-digital-talent/i18n";
import Loading, { type LoadingProps } from "@gc-digital-talent/ui";
import { isUuidError } from "@gc-digital-talent/helpers";

import ErrorMessage from "./ErrorMessage";

import "./pending.css";

interface PendingProps extends LoadingProps {
  fetching: boolean;
  error?: CombinedError;
  children: React.ReactNode;
}

const Pending = ({
  fetching,
  error,
  live,
  inline = false,
  children,
}: PendingProps): JSX.Element => {
  const intl = useIntl();
  if (fetching) {
    return <Loading inline={inline} live={live} />;
  }

  if (error) {
    if (isUuidError(error)) {
      throw new Response("", {
        status: 404,
        statusText: intl.formatMessage(commonMessages.notFound),
      });
    }

    return <ErrorMessage error={error} />;
  }

  return (
    <React.Suspense
      fallback={
        <Loading>
          {intl.formatMessage({
            defaultMessage: "Loading...",
            id: "FTJdsa",
            description: "Message to display when a page is loading.",
          })}
        </Loading>
      }
    >
      {children}
    </React.Suspense>
  );
};

export default Pending;
