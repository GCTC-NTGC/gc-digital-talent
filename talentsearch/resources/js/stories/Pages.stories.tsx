import React from "react";
import { storiesOf } from "@storybook/react";
import HomePage from "../components/HomePage";
import SearchPage from "../components/search/SearchPage";
import RequestPage from "../components/request/RequestPage";

const stories = storiesOf("Pages", module);

stories.add("Home Page", () => {
  return <HomePage />;
});

stories.add("Search Page", () => {
  return <SearchPage />;
});
