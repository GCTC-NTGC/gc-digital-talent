import type { StoryFn } from "@storybook/react-vite";

export default function ContainerDecorator(Story: StoryFn) {
  return (
    <div className="bg-gray-100 font-sans text-black dark:bg-gray-700 dark:text-white">
      <Story />
    </div>
  );
}
