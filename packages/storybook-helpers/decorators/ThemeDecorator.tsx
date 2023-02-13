import React from "react";
import type { StoryContext, StoryFn } from "@storybook/react";
import isChromatic from "chromatic/isChromatic";
import { ThemeProvider } from "@gc-digital-talent/theme";

export const theme = {
  name: "Theme",
  description: "Global theme for components",
  defaultValue: "pref",
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

const FontWrapper = ({ children }: { children: React.ReactNode }) => (
  <div data-h2-color="base(black) base:dark(white)">{children}</div>
);

const ThemeDecorator = (
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
  const { hasDarkMode } = parameters;
  const showDark = hasDarkMode && isChromatic();
  const StoryWrapper = hasDarkMode ? FontWrapper : React.Fragment;

  return showDark ? (
    <>
      <div id="override-theme-light" data-h2>
        <ThemeProvider
          override="light"
          themeSelector="#override-theme-light[data-h2]"
        >
          <FontWrapper>
            <Story />
          </FontWrapper>
        </ThemeProvider>
      </div>
      <div id="override-theme-dark" data-h2>
        <ThemeProvider
          override="dark"
          themeSelector="#override-theme-dark[data-h2]"
        >
          <FontWrapper>
            <Story />
          </FontWrapper>
        </ThemeProvider>
      </div>
    </>
  ) : (
    <ThemeProvider override={theme}>
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    </ThemeProvider>
  );
};

export default ThemeDecorator;
