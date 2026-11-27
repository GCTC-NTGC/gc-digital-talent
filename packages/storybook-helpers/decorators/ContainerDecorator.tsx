import type { Decorator } from "@storybook/react-vite";

const ContainerDecorator: Decorator = (Story) => (
  <div className="bg-background font-sans text-black dark:text-white">
    <Story />
  </div>
);

export default ContainerDecorator;
