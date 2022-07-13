import React from "react";
import { Tab as ReachTab, useTabsContext, type TabProps } from "@reach/tabs";

const Tab = (props: TabProps) => {
  const { index, children } = props;
  const { selectedIndex } = useTabsContext();
  const isSelected = index === selectedIndex;

  return (
    <ReachTab
      data-h2-shadow="base(xs)"
      data-h2-text-align="base(center)"
      data-h2-flex-direction="base(column)"
      data-h2-align-items="base(stretch)"
      {...(isSelected
        ? {
            "data-h2-background-color": "base(dt-white)",
          }
        : {
            "data-h2-background-color": "base(dt-gray.light)",
          })}
      {...props}
    >
      <span
        {...(isSelected
          ? {
              "data-h2-background-color": "base(dt-primary.light)",
            }
          : {
              "data-h2-background-color": "base(dt-gray.light)",
            })}
      />
      <span
        data-h2-font-size="base(h6)"
        {...(isSelected
          ? {
              "data-h2-background-color": "base(dt-white)",
              "data-h2-color": "base(dt-primary.light)",
            }
          : {
              "data-h2-background-color": "base(dt-gray.light)",
            })}
      >
        {children}
      </span>
    </ReachTab>
  );
};

export default Tab;
