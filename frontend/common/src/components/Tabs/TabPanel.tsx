import React from "react";
import { TabPanel as ReachTabPanel, type TabPanelProps } from "@reach/tabs";

const TabPanel = (props: TabPanelProps) => (
  <ReachTabPanel data-h2-padding="base(x.5)" {...props} />
);

export default TabPanel;
