import React from "react";
import { Story, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

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
      options: [
        "primary",
        "secondary",
        "tertiary",
        "quaternary",
        "quinary",
        "black",
        "white",
      ],
    },
  },
} as Meta;

const Template: Story = (args) => {
  const { label, icon } = args;
  faker.seed(0);
  const Cards = (
    <div>
      <CardLink
        color="primary"
        label={label}
        href="#"
        icon={icon}
        subtitle={faker.lorem.words(5)}
      >
        Primary
      </CardLink>
      <CardLink
        color="secondary"
        label={label}
        href="#"
        icon={icon}
        subtitle={faker.lorem.words(5)}
      >
        Secondary
      </CardLink>
      <CardLink
        color="tertiary"
        label={label}
        href="#"
        icon={icon}
        subtitle={faker.lorem.words(5)}
      >
        Tertiary
      </CardLink>
      <CardLink
        color="quaternary"
        label={label}
        href="#"
        icon={icon}
        subtitle={faker.lorem.words(5)}
      >
        Quaternary
      </CardLink>
      <CardLink
        color="quinary"
        label={label}
        href="#"
        icon={icon}
        subtitle={faker.lorem.words(5)}
      >
        Quinary
      </CardLink>
      <CardLink
        color="black"
        label={label}
        href="#"
        icon={icon}
        subtitle={faker.lorem.words(5)}
      >
        Quinary
      </CardLink>
      <CardLink
        color="white"
        label={label}
        href="#"
        icon={icon}
        subtitle={faker.lorem.words(5)}
      >
        Quinary
      </CardLink>
    </div>
  );
  return (
    <div>
      <div
        data-h2-display="base(grid) base:children[>div>div](grid)"
        data-h2-grid-template-columns="base(1fr) base:children[>div>div](repeat(7, minmax(0, 1fr)))"
        data-h2-height="base:children[>div>div](100%)"
        data-h2-padding="base:children[>div>div](x2)"
        data-h2-gap="base:children[>div>div](x1)"
        data-h2-background-color="base:children[>div>div](background)"
      >
        <div data-h2="light">{Cards}</div>
        <div data-h2="dark">{Cards}</div>
        <div data-h2="iap light">{Cards}</div>
        <div data-h2="iap dark">{Cards}</div>
      </div>
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
