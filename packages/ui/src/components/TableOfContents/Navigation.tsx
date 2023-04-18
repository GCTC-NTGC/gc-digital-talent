import React from "react";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";
import { useFeatureFlags } from "@gc-digital-talent/env";

import Sidebar from "./Sidebar";

const Navigation = ({ children, ...rest }: { children?: React.ReactNode }) => {
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
  const alignItemsStyles = featureFlags.applicantDashboard
    ? {}
    : {
        "data-h2-align-items": "base(flex-start) l-tablet(flex-end)",
      };

  return (
    <Sidebar>
      <div {...textAlignStyles} {...rest}>
        <h2
          id={`toc-heading-${id}`}
          data-h2-font-size="base(h5, 1)"
          data-h2-font-weight="base(700)"
          data-h2-padding="base(x3, 0, x1, 0)"
        >
          {intl.formatMessage(uiMessages.onThisPage)}
        </h2>
        <nav aria-labelledby={`toc-heading-${id}`} {...alignItemsStyles}>
          <ul
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-list-style="base(none)"
            data-h2-padding="base(0)"
          >
            {children}
          </ul>
        </nav>
      </div>
    </Sidebar>
  );
};

export default Navigation;
