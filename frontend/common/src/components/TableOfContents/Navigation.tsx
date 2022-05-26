import React from "react";
import { useIntl } from "react-intl";

const Navigation: React.FC = ({ children }) => {
  const intl = useIntl();

  return (
    <div
      data-h2-flex-item="b(1of1) s(1of4)"
      data-h2-visibility="b(hidden) s(visible)"
      data-h2-text-align="b(right)"
      data-h2-position="b(sticky)"
    >
      <p
        id="toc-heading"
        data-h2-font-size="b(h5)"
        data-h2-font-weight="b(800)"
        data-h2-margin="b(top, l)"
      >
        {intl.formatMessage({
          defaultMessage: "On this page",
          description: "Title for  pages table of contents.",
        })}
      </p>
      <nav
        aria-labelledby="toc-heading"
        data-h2-display="b(flex)"
        data-h2-flex-direction="b(column)"
        data-h2-align-items="b(flex-end)"
      >
        {children}
      </nav>
    </div>
  );
};

export default Navigation;
