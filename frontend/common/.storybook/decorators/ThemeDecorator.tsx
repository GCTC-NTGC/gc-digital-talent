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

  return showDark || parameters.hasDarkMode ? (
    <>
      <div id="override-theme-light" data-h2>
        <ThemeProvider
          override="light"
          themeSelector="#override-theme-light[data-h2]"
        >
          <Story />
        </ThemeProvider>
      </div>
      <div id="override-theme-dark" data-h2>
        <ThemeProvider
          override="dark"
          themeSelector="#override-theme-dark[data-h2]"
        >
          <Story />
        </ThemeProvider>
      </div>
    </>
  ) : (
    <ThemeProvider override={theme}>
      <Story />
    </ThemeProvider>
  );
};

export default withThemeProvider;
