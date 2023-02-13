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

interface SpacerProps {
  children: React.ReactNode;
}

const Spacer = ({ children }: SpacerProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-align-items="base(center)"
    style={{ padding: "1rem" }}
  >
    {children}
  </div>
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
      options: ["ts-primary", "ia-primary", "ia-secondary"],
    },
  },
} as Meta;

const Template: Story = (args) => {
  const { label, icon } = args;
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-justify-content="base(space-around)"
      style={{ margin: "-1rem" }}
    >
      <Spacer>
        <CardLink color="ts-primary" label={label} href="#" icon={icon}>
          TS Primary
        </CardLink>
      </Spacer>
      <Spacer>
        <CardLink color="ia-primary" label={label} href="#" icon={icon}>
          IA Primary
        </CardLink>
      </Spacer>
      <Spacer>
        <CardLink color="ia-secondary" label={label} href="#" icon={icon}>
          IA Secondary
        </CardLink>
      </Spacer>
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
