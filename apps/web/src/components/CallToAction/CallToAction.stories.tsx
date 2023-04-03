import React from "react";
import type { Meta, Story } from "@storybook/react";

import CallToActionLink from "./CallToActionLink";
import CallToActionButton from "./CallToActionButton";
import type { Color, CallToActionProps } from "./types";
import { HireIcon, JobIcon, ProfileIcon, HomeIcon, SupportIcon } from "./Icons";

const colors = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
] as Array<Color>;

const iconMap = new Map<Color, CallToActionProps<HTMLElement>["Icon"]>([
  ["primary", SupportIcon],
  ["secondary", HireIcon],
  ["tertiary", HomeIcon],
  ["quaternary", JobIcon],
  ["quinary", ProfileIcon],
]);

export default {
  component: CallToActionLink,
  title: "Components/CallToAction",
} as Meta;

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
        {colors.map((color) => (
          <CallToActionLink
            key={color}
            color={color}
            type="link"
            Icon={iconMap.get(color) || HomeIcon}
            content={content}
            href="#"
          >
            Call to Action Link
          </CallToActionLink>
        ))}
      </div>
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.5)"
        data-h2-flex-direction="base(column)"
        data-h2-max-width="base(x15)"
      >
        <p>Button variation</p>
        {colors.map((color) => (
          <CallToActionButton
            key={color}
            color={color}
            type="link"
            Icon={iconMap.get(color) || HomeIcon}
            content={content}
          >
            Call to Action Button
          </CallToActionButton>
        ))}
      </div>
    </div>
  );
};

export const Default = Template.bind({});
