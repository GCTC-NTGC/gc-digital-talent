import React from "react";
import { StoryFn } from "@storybook/react";
import Link from "./Link";
import ExternalLink, { ExternalLinkProps } from "./ExternalLink";
import type { LinkProps } from "./Link";
import { Color } from "../../types";

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
};

const colors: Array<Color> = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
];
const stoplight: Array<Color> = ["success", "warning", "error"];
const black: Array<Color> = ["black"];
const white: Array<Color> = ["white"];

type Story = StoryFn<Omit<LinkProps, "ref"> & { label: string }>;

const TemplateLink: Story = (args) => {
  const { label, ...rest } = args;

  return (
    <Link {...rest}>
      <span>{label}</span>
    </Link>
  );
};

const TemplateLinkColors: Story = (args) => {
  const { label, ...rest } = args;
  return (
    <div data-h2-display="base(flex)">
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {colors.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Link color={color} {...rest}>
              <span>{label}</span>
            </Link>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {stoplight.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Link color={color} {...rest}>
              <span>{label}</span>
            </Link>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {black.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Link color={color} {...rest}>
              <span>{label}</span>
            </Link>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(black)">
        {white.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Link color={color} {...rest}>
              <span>{label}</span>
            </Link>
          </p>
        ))}
      </div>
    </div>
  );
};

const TemplateExternalLink: StoryFn<ExternalLinkProps & { label: string }> = (
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
LinkDefault.args = {
  type: "link",
};

export const LinkButtonSolid = TemplateLinkColors.bind({});
LinkButtonSolid.args = {
  mode: "solid",
};

export const LinkButtonOutline = TemplateLinkColors.bind({});
LinkButtonOutline.args = {
  mode: "outline",
};

export const LinkButtonInline = TemplateLinkColors.bind({});
LinkButtonInline.args = {
  mode: "inline",
};

export const LinkButtonBlock = TemplateLink.bind({});
LinkButtonBlock.args = {
  mode: "solid",
  block: true,
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
