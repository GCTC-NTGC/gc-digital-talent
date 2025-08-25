import { HelmetProvider } from "react-helmet-async";
import type { Decorator } from "@storybook/react-vite";

const HelmetDecorator: Decorator = (Story) => (
  <HelmetProvider>
    <Story />
  </HelmetProvider>
);

export default HelmetDecorator;
