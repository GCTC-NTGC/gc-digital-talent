import React from "react";
import type { CombinedError } from "urql";
import ErrorMessage from "./ErrorMessage";

import Loading, { type LoadingProps } from "./Loading";

import "./pending.css";

interface PendingProps extends LoadingProps {
  fetching: boolean;
  error?: CombinedError;
}

const Pending: React.FC<PendingProps> = ({
  fetching,
  error,
  live,
  inline = false,
  children,
}) => {
  if (fetching) {
    return <Loading inline={!!inline} live={live} />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return children as React.ReactElement;
};

export default Pending;
