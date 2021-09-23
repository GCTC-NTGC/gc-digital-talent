import React from "react";
import { storiesOf } from "@storybook/react";
import SearchDashboard from "../components/SearchDashboard";
import SearchPage from "../components/search/SearchPage";

const stories = storiesOf("Search Dashboard", module);

stories.add("Search Dashboard", () => {
  return <SearchDashboard />;
});

stories.add("Search Page", () => {
  return <SearchPage />;
});
