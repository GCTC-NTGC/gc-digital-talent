import { StoryFn, Meta } from "@storybook/react-vite";
import { ReactNode } from "react";

import NotFound from "./NotFound";

export default {
  component: NotFound,
} as Meta;

interface StoryArgs {
  headingMessage: string;
  children: ReactNode;
}

const Template: StoryFn<StoryArgs> = (args) => {
  const { headingMessage, children } = args;
  return <NotFound headingMessage={headingMessage}>{children}</NotFound>;
};

export const Default = Template.bind({});
Default.args = {
  headingMessage: "Sorry, we can't find the page you were looking for.",
  children: (
    <>
      <p>
        Oops, it looks like you&apos;ve landed on a page that either
        doesn&apos;t exist or has moved.
      </p>
      <p>
        If you haven&apos;t found what you&apos;re looking for please get in
        touch with us directly.
      </p>
    </>
  ),
};
