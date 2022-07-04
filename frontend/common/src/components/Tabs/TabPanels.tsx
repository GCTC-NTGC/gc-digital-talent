import React from "react";
import { TabPanels as ReachTabPanels, type TabPanelsProps } from "@reach/tabs";

const TabPanels = (props: TabPanelsProps) => (
  <ReachTabPanels
    data-h2-bg-color="b(white)"
    data-h2-shadow="b(xs)"
    {...props}
  />
);

export default TabPanels;
