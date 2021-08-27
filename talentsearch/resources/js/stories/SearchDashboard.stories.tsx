import React from "react";
import { storiesOf } from "@storybook/react";
import SearchDashboard from "../components/SearchDashboard";

const stories = storiesOf("Search Dashboard", module);

stories.add("Dashboard", () => {
  return <SearchDashboard />;
});
