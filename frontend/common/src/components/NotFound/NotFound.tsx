import React from "react";

export interface NotFoundProps {
  headingMessage: string;
  children: React.ReactNode;
}

const NotFound: React.FC<NotFoundProps> = ({ headingMessage, children }) => {
  return (
    <div
      data-h2-flex-grid="b(flex-start, 0, x3)"
      data-h2-container="b(center, l)"
      aria-live="polite"
    >
      <div data-h2-flex-item="b(1of1)" data-h2-text-align="b(center)">
        <h3
          data-h2-font-size="b(h4, 1.3)"
          data-h2-font-weight="b(700)"
          data-h2-margin="b(auto, auto, x1, auto)"
        >
          {headingMessage}
        </h3>
        {children}
      </div>
    </div>
  );
};

export default NotFound;
