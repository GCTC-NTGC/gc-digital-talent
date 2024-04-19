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
    <div data-h2-margin="base(x3, 0)">
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-flex-grid="base(flex-start, x3)">
          <div data-h2-flex-item="base(1of1)" data-h2-text-align="base(center)">
            <h3
              data-h2-font-size="base(h4, 1.3)"
              className="font-bold"
              data-h2-margin="base(0, 0, x1, 0)"
            >
              {error.messages.title}
            </h3>
            {error.messages.body}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminErrorPage;
