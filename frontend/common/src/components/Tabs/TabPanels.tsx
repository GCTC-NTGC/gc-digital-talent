import React from "react";
import { TabPanels as ReachTabPanels, type TabPanelsProps } from "@reach/tabs";

const TabPanels = (props: TabPanelsProps) => (
  <ReachTabPanels
    data-h2-background-color="base(dt-white)"
    data-h2-shadow="base(xs)"
    {...props}
  />
);

export default TabPanels;
