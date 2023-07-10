import React from "react";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";

import { commonMessages, uiMessages } from "@gc-digital-talent/i18n";
import { useFeatureFlags } from "@gc-digital-talent/env";

import Sidebar from "./Sidebar";

type NavigationProps = React.HTMLProps<HTMLDivElement>;

const Navigation = ({ children, ...rest }: NavigationProps) => {
  const intl = useIntl();
  const featureFlags = useFeatureFlags();
  const id = uniqueId();

  const textAlignStyles = featureFlags.applicantDashboard
    ? {
        "data-h2-text-align": "base(left)",
      }
    : {
        "data-h2-text-align": "base(left) l-tablet(right)",
      };

  return (
    <Sidebar {...textAlignStyles} {...rest}>
      <h2
        id={`toc-heading-${id}`}
        data-h2-font-size="base(h6, 1)"
        data-h2-font-weight="base(700)"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage(uiMessages.onThisPage)}
        {intl.formatMessage(commonMessages.dividingColon)}
      </h2>
      <nav aria-labelledby={`toc-heading-${id}`}>{children}</nav>
    </Sidebar>
  );
};

export default Navigation;
