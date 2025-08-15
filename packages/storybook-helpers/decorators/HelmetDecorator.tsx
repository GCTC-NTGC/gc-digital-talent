import { HelmetProvider } from "react-helmet-async";
import { Decorator } from "@storybook/react-vite";

export const HelmetDecorator: Decorator = (Story) => (
  <HelmetProvider>
    <Story />
  </HelmetProvider>
);

export default HelmetDecorator;
