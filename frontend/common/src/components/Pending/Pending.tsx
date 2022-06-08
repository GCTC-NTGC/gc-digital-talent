import React from "react";
import type { CombinedError } from "urql";
import ErrorMessage from "./ErrorMessage";

import Loading from "./Loading";

import "./pending.css";

interface PendingProps {
  fetching: boolean;
  error?: CombinedError;
}

const Pending: React.FC<PendingProps> = ({ fetching, error, children }) => {
  if (fetching) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return children as React.ReactElement;
};

export default Pending;
