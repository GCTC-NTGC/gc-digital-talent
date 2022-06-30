import React from "react";
import { Tab as ReachTab, useTabsContext, type TabProps } from "@reach/tabs";

const Tab = (props: TabProps) => {
  const { index, children } = props;
  const { selectedIndex } = useTabsContext();
  const isSelected = index === selectedIndex;

  return (
    <ReachTab
      data-h2-shadow="b(xs)"
      data-h2-text-align="b(center)"
      data-h2-flex-direction="b(column)"
      data-h2-align-items="b(stretch)"
      {...(isSelected
        ? {
            "data-h2-bg-color": "b(white)",
          }
        : {
            "data-h2-bg-color": "b(lightgray)",
          })}
      {...props}
    >
      <span
        {...(isSelected
          ? {
              "data-h2-bg-color": "b(lightpurple)",
            }
          : {
              "data-h2-bg-color": "b(lightgray)",
            })}
      />
      <span
        data-h2-font-size="b(h6)"
        {...(isSelected
          ? {
              "data-h2-bg-color": "b(white)",
              "data-h2-font-color": "b(lightpurple)",
            }
          : {
              "data-h2-bg-color": "b(lightgray)",
            })}
      >
        {children}
      </span>
    </ReachTab>
  );
};

export default Tab;
