import React from "react";
import type { StoryContext, StoryFn } from "@storybook/react";
import ThemeProvider from "../../src/components/Theme";

export const theme = {
  name: "Theme",
  description: "Global theme for components",
  defaultValue: "light",
  toolbar: {
    icon: "circlehollow",
    // Array of plain string values or MenuItem shape (see below)
    items: [
      {
        value: "pref",
        right: "🖥",
        title: "Preference",
      },
      {
        value: "light",
        right: "☀️",
        title: "Light",
      },
      {
        value: "dark",
        right: "🌙",
        title: "Dark",
      },
    ],
    // Property that specifies if the name of the item will be displayed
    showName: true,
    // Change title based on selected value
    dynamicTitle: true,
  },
};

const withThemeProvider = (Story: StoryFn, context: StoryContext) => (
  <ThemeProvider override={context.globals.theme}>
    <Story />
  </ThemeProvider>
);

export default withThemeProvider;
