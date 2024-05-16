import { HelmetProvider } from "react-helmet-async";
import { StoryFn } from "@storybook/react";

const HelmetDecorator = (Story: StoryFn) => (
  <HelmetProvider>
    <Story />
  </HelmetProvider>
);

export default HelmetDecorator;
