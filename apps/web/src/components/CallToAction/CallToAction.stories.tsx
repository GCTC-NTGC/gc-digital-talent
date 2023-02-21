import React from "react";
import type { Meta, Story } from "@storybook/react";

import CallToAction from "./CallToAction";
import type { CallToActionContext } from "./CallToAction";

export default {
  component: CallToAction,
  title: "Components/CallToAction",
  args: {
    content: {
      path: "#",
      label: "Test call-to-action",
    },
  },
} as Meta;

const contextMap: Array<CallToActionContext> = [
  "hire",
  "job",
  "profile",
  "home",
  "support",
];

const Template: Story = (args) => {
  const { content } = args;
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-gap="base(x2)"
      data-h2-flex-direction="base(row)"
      data-h2-padding="base(x2)"
      data-h2-background="base(background)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.5)"
        data-h2-flex-direction="base(column)"
        data-h2-max-width="base(x15)"
      >
        <p>Link variation</p>
        {contextMap.map((context) => (
          <CallToAction
            key=""
            type="link"
            context={context}
            content={content}
          />
        ))}
      </div>
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.5)"
        data-h2-flex-direction="base(column)"
        data-h2-max-width="base(x15)"
      >
        <p>Button variation</p>
        {contextMap.map((context) => (
          <CallToAction
            key=""
            type="button"
            context={context}
            content={content}
          />
        ))}
      </div>
    </div>
  );
};

export const Default = Template.bind({});
