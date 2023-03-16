import React from "react";
import { useIntl } from "react-intl";
import type { CombinedError } from "urql";

import { commonMessages } from "@gc-digital-talent/i18n";
import { isUuidError } from "@gc-digital-talent/helpers";

import Loading, { LoadingProps } from "../Loading";

import ErrorMessage from "./ErrorMessage";

import "./pending.css";

export interface PendingProps extends LoadingProps {
  fetching: boolean;
  error?: CombinedError;
  children: React.ReactNode;
}

const Pending = ({
  fetching,
  error,
  live = "assertive",
  inline = false,
  children,
}: PendingProps): JSX.Element => {
  const intl = useIntl();
  if (fetching) {
    return (
      <Loading inline={inline} live={live}>
        {intl.formatMessage(commonMessages.loadingTitle)}
      </Loading>
    );
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
        <Loading inline={inline} live={live}>
          {intl.formatMessage(commonMessages.loadingTitle)}
        </Loading>
      }
    >
      {children}
    </React.Suspense>
  );
};

export default Pending;
