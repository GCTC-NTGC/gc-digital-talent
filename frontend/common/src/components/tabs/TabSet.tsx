import React, { useState } from "react";
import { TabProps } from "./Tab";

export interface TabSetProps extends React.HTMLProps<HTMLElement> {
  /** The style type of the element. */
  color: "primary";
  /** The style mode of the element. */
  mode: "inline";
  children: React.ReactElement<TabProps>[];
}

interface TabSetState {
  selectedTab: number;
  isOpen: boolean;
}

const firstSelectableTab = (tabs: React.ReactElement<TabProps>[]): number => {
  const firstIndex = tabs.findIndex(
    (tab: React.ReactElement<TabProps>) =>
      tab.props.behavior == null || tab.props.behavior === "default",
  );
  return firstIndex >= 0 ? firstIndex : 0;
};

export const TabSet: React.FC<TabSetProps> = ({
  color,
  mode,
  children,
}): React.ReactElement => {
  const [tabSetState, setTabSetState] = useState<TabSetState>({
    selectedTab: firstSelectableTab(children),
    isOpen: true,
  });

  const handleTabSelect = (index: number) => {
    setTabSetState({
      ...tabSetState,
      isOpen: true,
      selectedTab: index,
    });
  };
  const handleToggleOpen = () => {
    setTabSetState({
      ...tabSetState,
      isOpen: !tabSetState.isOpen,
    });
  };

  // https://stackoverflow.com/a/32371612
  const childrenWithProps = React.Children.map(children, (child, index) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        isTabSetOpen: tabSetState.isOpen,
        isTabSelected: tabSetState.selectedTab === index,
        onSelect: () => handleTabSelect(index),
        onToggleOpen: () => handleToggleOpen(),
      });
    }
    return child;
  });

  return (
    <>
      <div
        data-h2-display="b(flex)"
        data-h2-align-items="b(center)"
        data-h2-margin="b(bottom, s)"
      >
        {childrenWithProps}
      </div>
      <div
        {...(tabSetState.isOpen
          ? { "data-h2-visibility": "b(visible)" }
          : { "data-h2-visibility": "b(invisible)" })}
      >
        {children[tabSetState.selectedTab].props.children}
      </div>
    </>
  );
};

export default TabSet;
