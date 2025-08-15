import { Decorator } from "@storybook/react-vite";

export const ContainerDecorator: Decorator = (Story) => (
  <div className="bg-gray-100 font-sans text-black dark:bg-gray-700 dark:text-white">
    {Story()}
  </div>
);

export default ContainerDecorator;
