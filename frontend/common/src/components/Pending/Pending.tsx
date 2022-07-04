import React from "react";
import type { CombinedError } from "urql";
import ErrorMessage from "./ErrorMessage";

import Loading, { type LoadingProps } from "./Loading";

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
  if (fetching) {
    return (
      <>
        <Loading inline={inline} live={live} />
        {children}
      </>
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return children as React.ReactElement;
};

export default Pending;
