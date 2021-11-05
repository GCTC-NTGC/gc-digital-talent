import React, { ReactElement } from "react";

export interface NotFoundProps {
  headingMessage: string;
  children: React.ReactNode;
}

const NotFound: React.FC<NotFoundProps> = ({
  headingMessage: headingMessage,
  children,
}) => {
  return (
    <div
      data-h2-flex-grid="b(top, contained, flush, xl)"
      data-h2-container="b(center, l)"
    >
      <div data-h2-flex-item="b(1of1) s(2of3)">
        <h3
          data-h2-font-size="b(h4)"
          data-h2-font-weight="b(700)"
          data-h2-margin="b(bottom, m)"
        >
          {headingMessage}
        </h3>
        {children}
      </div>
    </div>
  );
};

export default NotFound;
