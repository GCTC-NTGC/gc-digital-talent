import React from "react";
import { Story, Meta } from "@storybook/react";
import Link from "./Link";
import type { LinkProps } from "./Link";

export default {
  component: Link,
  title: "Components/Link",
  args: {
    label: "Link Label",
  },
  argTypes: {
    label: {
      name: "label",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
  },
} as Meta;

const TemplateLink: Story<LinkProps & { label: string }> = (args) => {
  const { label, ...rest } = args;
  return (
    <Link {...rest}>
      <span>{label}</span>
    </Link>
  );
};

export const LinkDefault = TemplateLink.bind({});
export const LinkButtonPrimary = TemplateLink.bind({});
export const LinkButtonPrimaryBlock = TemplateLink.bind({});
export const LinkButtonPrimaryOutline = TemplateLink.bind({});
export const LinkButtonPrimaryInline = TemplateLink.bind({});
export const LinkButtonSecondary = TemplateLink.bind({});
export const LinkButtonSecondaryBlock = TemplateLink.bind({});
export const LinkButtonSecondaryOutline = TemplateLink.bind({});
export const LinkButtonSecondaryInline = TemplateLink.bind({});
export const LinkButtonCTA = TemplateLink.bind({});
export const LinkButtonCTABlock = TemplateLink.bind({});
export const LinkButtonCTAOutline = TemplateLink.bind({});
export const LinkButtonCTAInline = TemplateLink.bind({});
export const LinkButtonWhite = TemplateLink.bind({});
export const LinkButtonWhiteBlock = TemplateLink.bind({});
export const LinkButtonWhiteOutline = TemplateLink.bind({});
export const LinkButtonWhiteInline = TemplateLink.bind({});

LinkDefault.args = {
  type: "link",
};

LinkButtonPrimary.args = {
  color: "primary",
  type: "button",
  mode: "solid",
};

LinkButtonPrimaryBlock.args = {
  color: "primary",
  type: "button",
  mode: "solid",
  block: true,
};

LinkButtonPrimaryOutline.args = {
  color: "primary",
  type: "button",
  mode: "outline",
};

LinkButtonPrimaryInline.args = {
  color: "primary",
  type: "button",
  mode: "inline",
};

LinkButtonSecondary.args = {
  color: "secondary",
  type: "button",
  mode: "solid",
};

LinkButtonSecondaryBlock.args = {
  color: "secondary",
  type: "button",
  mode: "solid",
  block: true,
};

LinkButtonSecondaryOutline.args = {
  color: "secondary",
  type: "button",
  mode: "outline",
};

LinkButtonSecondaryInline.args = {
  color: "secondary",
  type: "button",
  mode: "inline",
};

LinkButtonCTA.args = {
  color: "cta",
  type: "button",
  mode: "solid",
};

LinkButtonCTABlock.args = {
  color: "cta",
  type: "button",
  mode: "solid",
  block: true,
};

LinkButtonCTAOutline.args = {
  color: "cta",
  type: "button",
  mode: "outline",
};

LinkButtonWhiteInline.args = {
  color: "white",
  type: "button",
  mode: "inline",
};

LinkButtonWhite.args = {
  color: "white",
  type: "button",
  mode: "solid",
};

LinkButtonWhiteBlock.args = {
  color: "white",
  type: "button",
  mode: "solid",
  block: true,
};

LinkButtonWhiteOutline.args = {
  color: "white",
  type: "button",
  mode: "outline",
};

LinkButtonWhiteInline.args = {
  color: "white",
  type: "button",
  mode: "inline",
};

LinkButtonWhite.parameters = {
  backgrounds: { default: "dark" },
};

LinkButtonWhiteOutline.parameters = {
  backgrounds: { default: "dark" },
};

LinkButtonWhiteInline.parameters = {
  backgrounds: { default: "dark" },
};
