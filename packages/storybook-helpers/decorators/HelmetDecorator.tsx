import { HelmetProvider } from "@dr.pogodin/react-helmet";
import type { Decorator } from "@storybook/react-vite";

const HelmetDecorator: Decorator = (Story) => (
  <HelmetProvider>
    <Story />
  </HelmetProvider>
);

export default HelmetDecorator;
