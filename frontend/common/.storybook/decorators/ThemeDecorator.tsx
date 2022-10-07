import React from "react";
import type { StoryContext, StoryFn } from "@storybook/react";
import isChromatic from "chromatic/isChromatic";
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

interface ThemeBlockProps {
  children: React.ReactNode;
}

const withThemeProvider = (
  Story: StoryFn,
  { globals, parameters }: StoryContext,
) => {
  const theme = globals.theme || parameters.theme;

  /**
   * HACK: Since we have only one dark mode story
   * We need to set the parameter for it. Once we
   * have more dark mode stories, we should remove
   * The parameter from usage
   */
  const showDark = parameters.hasDarkMode && isChromatic();

  return showDark ? (
    <>
      <ThemeProvider override="light">
        <Story />
      </ThemeProvider>
      <ThemeProvider override="dark">
        <Story />
      </ThemeProvider>
    </>
  ) : (
    <ThemeProvider override={theme}>
      <Story />
    </ThemeProvider>
  );
};

export default withThemeProvider;
