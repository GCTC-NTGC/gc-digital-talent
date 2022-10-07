import React from "react";
import type { StoryFn } from "@storybook/react";
import ThemeProvider from "../../src/components/Theme";

// Applies the ThemeContext to a story
export default function ThemeDecorator(Story: StoryFn) {
  return (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  );
}
