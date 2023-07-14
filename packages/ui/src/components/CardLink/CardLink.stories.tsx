import React from "react";
import { Story, Meta } from "@storybook/react";
import CardLink from "./CardLink";

const ExternalLink = (props: () => React.ReactElement) => (
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
  title: "Components/Card Link",
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
      options: ["primary", "secondary", "tertiary", "quaternary", "quinary"],
    },
  },
} as Meta;

const Template: Story = (args) => {
  const { label, icon } = args;
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(repeat(5, minmax(0, 1fr)))"
      data-h2-gap="base(x2)"
      data-h2-padding="base(x2)"
    >
      <CardLink color="primary" label={label} href="#" icon={icon}>
        Primary
      </CardLink>
      <CardLink color="secondary" label={label} href="#" icon={icon}>
        Secondary
      </CardLink>
      <CardLink color="tertiary" label={label} href="#" icon={icon}>
        Tertiary
      </CardLink>
      <CardLink color="quaternary" label={label} href="#" icon={icon}>
        Quaternary
      </CardLink>
      <CardLink color="quinary" label={label} href="#" icon={icon}>
        Quinary
      </CardLink>
    </div>
  );
};

export const BasicCardLink = Template.bind({});
export const IconCardLink = Template.bind({});

BasicCardLink.args = {
  label: "Basic Card Link",
};

IconCardLink.args = {
  label: "Icon Card Link",
  icon: ExternalLink,
};
