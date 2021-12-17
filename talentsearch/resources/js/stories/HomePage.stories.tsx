import React from "react";
import { storiesOf } from "@storybook/react";
import HomePage from "../components/HomePage";

const stories = storiesOf("Home Page", module);

stories.add("Home Page", () => {
  return <HomePage />;
});
