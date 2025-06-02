import { Fragment } from "react";
import { StoryFn } from "@storybook/react";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import { ButtonLinkMode, Color } from "../../types";
import Link from "./Link";
import type { LinkProps } from "./Link";

export default {
  component: Link,
  args: {
    label: "Link label",
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
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
};

const colors: Color[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
  "success",
  "warning",
  "error",
  "black",
  "white",
];

const modes: ButtonLinkMode[] = [
  "solid",
  "placeholder",
  "text",
  "inline",
  "cta",
  "icon_only",
];

const Template: StoryFn<
  Omit<LinkProps, "color" | "ref"> & { label: string }
> = ({ label }) => {
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(1fr 1fr)"
    >
      {colors.map((color) => (
        <Fragment key={`${color}`}>
          {modes.map((mode) => (
            <Fragment key={`${color}-${mode}`}>
              <div
                {...(color === "white" && {
                  "data-h2-background-color": "base(black)",
                  "data-h2-font-color": "base(white)",
                })}
                {...(color !== "white" && {
                  "data-h2-background-color": "base(background)",
                  "data-h2-font-color": "base(black)",
                })}
                data-h2-padding="base(x1)"
              >
                <Link
                  href="https://talent.canada.ca"
                  mode={mode}
                  color={color}
                  icon={InformationCircleIcon}
                  aria-label={mode === "icon_only" ? label : undefined}
                  newTab
                >
                  {label}
                </Link>
                <p>{`${mode} ${color}`}</p>
              </div>
              <div
                {...(color === "white" && {
                  "data-h2-background-color": "base(black)",
                  "data-h2-font-color": "base(white)",
                })}
                {...(color !== "white" && {
                  "data-h2-background-color": "base(background)",
                  "data-h2-font-color": "base(black)",
                })}
                data-h2-padding="base(x1)"
              >
                <Link
                  href="https://talent.canada.ca"
                  mode={mode}
                  color={color}
                  icon={InformationCircleIcon}
                  aria-label={mode === "icon_only" ? label : undefined}
                  newTab
                  disabled
                >
                  {label}
                </Link>
                <p>{`${mode} ${color} disabled`}</p>
              </div>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export const Default = Template.bind({});
