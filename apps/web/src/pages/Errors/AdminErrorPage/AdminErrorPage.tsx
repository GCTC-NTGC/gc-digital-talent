import React from "react";
import { useLocation } from "react-router-dom";

import { useLogger } from "@gc-digital-talent/logger";

import useErrorMessages from "~/hooks/useErrorMessages";

const AdminErrorPage = () => {
  const location = useLocation();
  const error = useErrorMessages();
  const logger = useLogger();

  logger.notice(
    JSON.stringify({
      message: "ErrorPage triggered",
      pathname: location.pathname,
      error,
    }),
  );

  return (
    <div
      data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      className="mt-20 text-center"
    >
      <h1 data-h2-font-size="base(h4, 1.3)" className="mb-6 font-bold">
        {error.messages.title}
      </h1>
      {error.messages.body}
    </div>
  );
};

export default AdminErrorPage;
