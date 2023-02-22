import React from "react";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import Sidebar from "./Sidebar";

const Navigation: React.FC<{
  children?: React.ReactNode;
}> = ({ children, ...rest }) => {
  const intl = useIntl();
  const id = uniqueId();

  return (
    <Sidebar>
      <div data-h2-text-align="base(left) l-tablet(right)" {...rest}>
        <h2
          id={`toc-heading-${id}`}
          data-h2-font-size="base(h5, 1)"
          data-h2-font-weight="base(700)"
          data-h2-padding="base(x3, 0, x1, 0)"
        >
          {intl.formatMessage(uiMessages.onThisPage)}
        </h2>
        <nav
          aria-labelledby={`toc-heading-${id}`}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-align-items="base(flex-start) l-tablet(flex-end)"
        >
          {children}
        </nav>
      </div>
    </Sidebar>
  );
};

export default Navigation;
