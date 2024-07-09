import { ReactNode } from "react";

interface NotFoundProps {
  headingMessage: string;
  children: ReactNode;
}

const NotFound = ({ headingMessage, children }: NotFoundProps) => {
  return (
    <div data-h2-margin="base(x3, 0)">
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-flex-grid="base(flex-start, x3)" aria-live="polite">
          <div data-h2-flex-item="base(1of1)" data-h2-text-align="base(center)">
            <h3
              data-h2-font-size="base(h4, 1.3)"
              data-h2-font-weight="base(700)"
              data-h2-margin="base(0, 0, x1, 0)"
            >
              {headingMessage}
            </h3>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
