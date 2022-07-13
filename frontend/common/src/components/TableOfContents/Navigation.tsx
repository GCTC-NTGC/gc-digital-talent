import React from "react";
import { useIntl } from "react-intl";

const Navigation: React.FC = ({ children }) => {
  const intl = useIntl();

  return (
    <div
      data-h2-flex-item="base(1of1) p-tablet(1of4)"
      data-h2-visibility="base(hidden) p-tablet(visible)"
      data-h2-text-align="base(right)"
      data-h2-position="base(sticky)"
    >
      <p
        id="toc-heading"
        data-h2-font-size="base(h5, 1.3)"
        data-h2-font-weight="base(800)"
        data-h2-margin="base(x2, 0, 0, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "On this page",
          description: "Title for  pages table of contents.",
        })}
      </p>
      <nav
        aria-labelledby="toc-heading"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-align-items="base(flex-end)"
      >
        {children}
      </nav>
    </div>
  );
};

export default Navigation;
