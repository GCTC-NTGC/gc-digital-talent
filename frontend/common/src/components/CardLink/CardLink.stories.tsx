import React from "react";
import { Story, Meta } from "@storybook/react";
import CardLink from "./CardLink";

const ExternalLink: React.FC = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

export default {
  component: CardLink,
  title: "Component/Card Link",
  args: {
    label: "Card Link",
  },
  argsTypes: {
    label: {
      name: "label",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
    color: {
      options: ["ts-primary", "ia-primary", "ia-secondary"],
    },
  },
} as Meta;

const TemplateCardLink: Story = (args) => {
  const { label, color, icon } = args;
  return (
    <CardLink label={label} href="#" color={color} icon={icon}>
      Card Link
    </CardLink>
  );
};

export const BasicCardLink = TemplateCardLink.bind({});
export const IconCardLink = TemplateCardLink.bind({});
export const IAPrimaryCardLink = TemplateCardLink.bind({});
export const IASecondaryCardLink = TemplateCardLink.bind({});

BasicCardLink.args = {
  label: "Basic Card Link",
};

IconCardLink.args = {
  label: "Icon Card Link",
  icon: ExternalLink,
};

IAPrimaryCardLink.args = {
  label: "IAP Primary Card Link",
  color: "ia-primary",
};

IASecondaryCardLink.args = {
  label: "IAP Secondary Card Link",
  color: "ia-secondary",
};
