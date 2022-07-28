import React from "react";
import { TabPanel as ReachTabPanel, type TabPanelProps } from "@reach/tabs";

const TabPanel = (props: TabPanelProps) => (
  <ReachTabPanel
    data-h2-border="base(all, 1px, solid, dt-gray)"
    data-h2-radius="base(0, s, s, s)"
    data-h2-padding="base(x1, x.75)"
    {...props}
  />
);

export default TabPanel;
