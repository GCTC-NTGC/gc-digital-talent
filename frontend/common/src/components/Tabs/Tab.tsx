import React from "react";
import { Tab as ReachTab, useTabsContext, type TabProps } from "@reach/tabs";

import "@reach/tabs/styles.css";
import "./tabs.css";

const Tab = (props: TabProps) => {
  const { index, children } = props;
  const { selectedIndex } = useTabsContext();
  const isSelected = index === selectedIndex;

  return (
    <ReachTab
      data-h2-padding="base(x.5, x1)"
      data-h2-margin="base(0, x.5, 0, 0)"
      data-h2-position="base(relative)"
      data-h2-offset="base(1px, auto, auto, auto)"
      data-h2-radius="base(s, s, 0, 0)"
      {...(isSelected
        ? {
            "data-h2-background-color": "base(dt-white)",
            "data-h2-border":
              "base(right-left, 1px, solid, dt-gray) base(top, x.5, solid, dt-primary) base(bottom, 1px, solid, dt-white)",
          }
        : {
            "data-h2-background-color": "base(dt-white)",
            "data-h2-border":
              "base(all, 1px, solid, dt-gray) base(top, x.5, solid, dt-gray)",
          })}
      {...props}
    >
      <span>{children}</span>
    </ReachTab>
  );
};

export default Tab;
