import React from "react";

import useErrorMessages from "./useErrorMessages";

const ErrorPage = () => {
  const errorMessage = useErrorMessages();

  return (
    <div data-h2-margin="base(x3, 0)">
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-flex-grid="base(flex-start, x3)">
          <div data-h2-flex-item="base(1of1)" data-h2-text-align="base(center)">
            <h3
              data-h2-font-size="base(h4, 1.3)"
              data-h2-font-weight="base(700)"
              data-h2-margin="base(0, 0, x1, 0)"
            >
              {errorMessage.title}
            </h3>
            {errorMessage.body}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
