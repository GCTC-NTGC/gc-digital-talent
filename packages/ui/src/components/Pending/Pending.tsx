import React from "react";
import { useIntl } from "react-intl";
import type { CombinedError } from "urql";

import { commonMessages } from "@gc-digital-talent/i18n";
import { isUuidError } from "@gc-digital-talent/helpers";

import Loading, { LoadingProps } from "~/components/Loading";

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
        <Loading>{intl.formatMessage(commonMessages.loadingTitle)}</Loading>
      }
    >
      {children}
    </React.Suspense>
  );
};

export default Pending;
