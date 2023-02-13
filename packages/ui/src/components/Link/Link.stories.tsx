import React from "react";
import { Story, Meta } from "@storybook/react";
import Link from "./Link";
import ExternalLink, { ExternalLinkProps } from "./ExternalLink";
import type { LinkProps } from "./Link";
import { Color } from "../Button";

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

const colors: Array<Color> = [
  "primary",
  "secondary",
  "cta",
  "white",
  "black",
  "ia-primary",
  "ia-secondary",
];

const TemplateLink: Story<LinkProps & { label: string }> = (args) => {
  const { label, ...rest } = args;

  return (
    <Link {...rest}>
      <span>{label}</span>
    </Link>
  );
};

const TemplateLinkColors: Story<LinkProps & { label: string }> = (args) => {
  const { label, ...rest } = args;
  return (
    <>
      {colors.map((color) => (
        <p key={color}>
          <Link color={color} {...rest}>
            <span>{label}</span>
          </Link>
        </p>
      ))}
    </>
  );
};

const TemplateExternalLink: Story<ExternalLinkProps & { label: string }> = (
  args,
) => {
  const { label, ...rest } = args;
  return (
    <ExternalLink {...rest}>
      <span>{label}</span>
    </ExternalLink>
  );
};

export const LinkDefault = TemplateLink.bind({});
export const LinkButtonSolid = TemplateLinkColors.bind({});
export const LinkButtonOutline = TemplateLinkColors.bind({});
export const LinkButtonBlock = TemplateLinkColors.bind({});
export const LinkButtonDisabled = TemplateLinkColors.bind({});

LinkDefault.args = {
  type: "link",
};

LinkButtonSolid.args = {
  type: "button",
  mode: "solid",
};

LinkButtonOutline.args = {
  type: "button",
  mode: "outline",
};

LinkButtonBlock.args = {
  type: "button",
  mode: "solid",
  block: true,
};

LinkButtonDisabled.args = {
  type: "button",
  mode: "solid",
  disabled: true,
};

export const ExternalLinkNewTab = TemplateExternalLink.bind({});
export const ExternalLinkNotNewTab = TemplateExternalLink.bind({});

ExternalLinkNewTab.args = {
  newTab: true,
  href: "https://example.com",
};

ExternalLinkNotNewTab.args = {
  newTab: false,
  href: "https://example.com",
};
