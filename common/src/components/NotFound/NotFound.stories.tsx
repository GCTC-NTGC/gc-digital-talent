import React from "react";
import { Story, Meta } from "@storybook/react";
import NotFound from "./NotFound";

export default {
  component: NotFound,
  title: "Components/Not Found",
} as Meta;

const Template: Story = (args) => {
  const { headingMessage, children } = args;
  return <NotFound headingMessage={headingMessage}>{children}</NotFound>;
};

export const Example1 = Template.bind({});
Example1.args = {
  headingMessage: "Sorry, we can't find the page you were looking for.",
  children: (
    <>
      <p>
        Oops, it looks like you've landed on a page that either doesn't exist or
        has moved.
      </p>
      <p>
        If you haven't found what you're looking for please get in touch with us
        directly.
      </p>
    </>
  ),
};

export const Example2 = Template.bind({});
Example2.args = {
  headingMessage: "Sorry, we can't find the page you were looking for.",
  children: (
    <>
      <p>
        Oops, it looks like you've landed on a page that either doesn't exist or
        has moved. That's okay, here are a few options for other pages that may
        help you get rolling.
      </p>
      <ul>
        <li>
          <a href="" title="Home">
            Home
          </a>
        </li>
        <li>
          <a href="" title="Search">
            Search
          </a>
        </li>
      </ul>
      <p>
        If you still haven't found what you're looking for please&nbsp;
        <a
          href="mailto:talent.cloud-nuage.de.talents@tbs-sct.gc.ca"
          title="Send an email to Talent Cloud."
        >
          get in touch with us directly
        </a>
        .
      </p>
    </>
  ),
};
