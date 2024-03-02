import React from "react";
import type { StoryContext, StoryFn } from "@storybook/react";
import isChromatic from "chromatic/isChromatic";

import { ThemeProvider } from "@gc-digital-talent/theme";

export const themeKey = {
  description: "Global theme for components",
  defaultValue: "fallback",
  toolbar: {
    title: "Theme",
    icon: "circlehollow",
    // Array of plain string values or MenuItem shape (see below)
    items: [
      {
        value: "fallback",
        title: "Default",
      },
      {
        value: "default",
        title: "Digital Talent",
      },
      {
        value: "admin",
        title: "Admin",
      },
      {
        value: "iap",
        title: "IAP",
      },
    ],
    dynamicTitle: true,
  },
};

export const themeMode = {
  description: "Global theme mode for components",
  defaultValue: "pref",
  toolbar: {
    title: "Theme Mode",
    icon: "circlehollow",
    // Array of plain string values or MenuItem shape (see below)
    items: [
      {
        value: "pref",
        right: "🖥️",
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
  let key = globals.themeKey || parameters.themeKey || "default";
  const mode = globals.themeMode || parameters.themeMode || "pref";

  /**
   * HACK: Since we have only one dark mode story
   * We need to set the parameter for it. Once we
   * have more dark mode stories, we should remove
   * The parameter from usage
   */
  const { hasDarkMode } = parameters;
  const showDark = hasDarkMode && isChromatic();
  const StoryWrapper = hasDarkMode ? FontWrapper : React.Fragment;

  if (key === "fallback") {
    key = parameters.themeKey || "default";
  }

  return showDark ? (
    <>
      <div id="override-theme-light" data-h2>
        <ThemeProvider
          override={{
            key,
            mode: "light",
          }}
          themeSelector="#override-theme-light[data-h2]"
        >
          <FontWrapper>
            <Story />
          </FontWrapper>
        </ThemeProvider>
      </div>
      <div id="override-theme-dark" data-h2>
        <ThemeProvider
          override={{
            key,
            mode: "dark",
          }}
          themeSelector="#override-theme-dark[data-h2]"
        >
          <FontWrapper>
            <Story />
          </FontWrapper>
        </ThemeProvider>
      </div>
    </>
  ) : (
    <ThemeProvider
      override={{
        key,
        mode,
      }}
    >
      <StoryWrapper>
        <Story />
      </StoryWrapper>
    </ThemeProvider>
  );
};

export default ThemeDecorator;
