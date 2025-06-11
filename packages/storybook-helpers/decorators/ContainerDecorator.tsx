import type { StoryFn } from "@storybook/react-vite";

export default function ContainerDecorator(Story: StoryFn) {
  return (
    <div
      data-h2-color="base(black)"
      data-h2-background="base(background)"
      data-h2-font-family="base(sans)"
    >
      <Story />
    </div>
  );
}
