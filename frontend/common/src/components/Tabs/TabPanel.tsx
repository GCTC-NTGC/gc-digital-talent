import React from "react";
import { TabPanel as ReachTabPanel, type TabPanelProps } from "@reach/tabs";

const TabPanel = (props: TabPanelProps) => (
  <ReachTabPanel data-h2-padding="b(all, s)" {...props} />
);

export default TabPanel;
