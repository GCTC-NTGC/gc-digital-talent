import { useIntl } from "react-intl";
import type { CombinedError } from "urql";
import { ReactNode, Suspense } from "react";

import { commonMessages } from "@gc-digital-talent/i18n";
import { isUuidError } from "@gc-digital-talent/helpers";

import Loading, { LoadingProps } from "../Loading";
import ErrorMessage from "./ErrorMessage";

export interface PendingProps extends LoadingProps {
  fetching: boolean;
  error?: CombinedError;
  pause?: boolean;
  children: ReactNode;
}

const Pending = ({
  fetching,
  error,
  live = "polite",
  inline = false,
  pause = false,
  children,
}: PendingProps) => {
  const intl = useIntl();
  if (fetching) {
    return (
      <Loading inline={inline} live={live} pause={pause}>
        {intl.formatMessage(commonMessages.loadingTitle)}
      </Loading>
    );
  }

  if (error) {
    if (isUuidError(error)) {
      // NOTE: Used by react-router as a 404 error
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw new Response("", {
        status: 404,
        statusText: intl.formatMessage(commonMessages.notFound),
      });
    }

    return <ErrorMessage error={error} />;
  }

  return (
    <Suspense
      fallback={
        <Loading inline={inline} live={live} pause={pause}>
          {intl.formatMessage(commonMessages.loadingTitle)}
        </Loading>
      }
    >
      {children}
    </Suspense>
  );
};

export default Pending;
