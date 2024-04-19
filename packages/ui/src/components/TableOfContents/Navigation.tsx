import React from "react";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";

import { commonMessages, uiMessages } from "@gc-digital-talent/i18n";

import Sidebar from "../Sidebar/Sidebar";

type NavigationProps = React.HTMLProps<HTMLDivElement>;

const Navigation = ({ children, ...rest }: NavigationProps) => {
  const intl = useIntl();
  const id = uniqueId();

  const textAlignStyles = {
    "data-h2-text-align": "base(left)",
  };

  return (
    <Sidebar {...textAlignStyles} {...rest}>
      <h2
        id={`toc-heading-${id}`}
        data-h2-font-size="base(h6, 1)"
        className="font-bold"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage(uiMessages.onThisPage)}
        {intl.formatMessage(commonMessages.dividingColon)}
      </h2>
      <nav
        aria-labelledby={`toc-heading-${id}`}
        data-h2-text-align="base:children[>button, >a](center)"
        data-h2-margin-bottom="base(x3)"
      >
        {children}
      </nav>
    </Sidebar>
  );
};

export default Navigation;
