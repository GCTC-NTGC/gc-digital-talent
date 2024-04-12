import React from "react";
import { StoryFn } from "@storybook/react";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";

import { Color, ButtonLinkMode } from "../../types";
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
};

const colors: Array<Color> = [
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

const modes: Array<ButtonLinkMode> = [
  "solid",
  "placeholder",
  "text",
  "inline",
  "cta",
];

const themes: Array<string> = ["light", "dark", "light iap", "dark iap"];

const Template: StoryFn<Omit<LinkProps, "ref"> & { label: string }> = () => {
  return (
    <div>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="base(1fr 1fr 1fr 1fr)"
        data-h2-text-align="base(center)"
        data-h2-color="base(red)"
      >
        {themes.map((theme) => (
          <div key={theme} data-h2={theme}>
            {colors.map((color) => (
              <>
                {modes.map((mode) => (
                  <>
                    <div
                      key={`${theme}-${mode}`}
                      {...(color === "white" && {
                        "data-h2-background-color": "base(black)",
                      })}
                      {...(color !== "white" && {
                        "data-h2-background-color": "base(background)",
                      })}
                      data-h2-padding="base(x2 x2 x1 x2)"
                    >
                      <Link
                        href="https://google.com"
                        newTab
                        mode={mode}
                        color={color}
                        icon={InformationCircleIcon}
                        counter={99}
                      >
                        Example label
                      </Link>
                    </div>
                    <div
                      key=""
                      {...(color === "white" && {
                        "data-h2-background-color": "base(black)",
                      })}
                      {...(color !== "white" && {
                        "data-h2-background-color": "base(background)",
                      })}
                      data-h2-padding="base(x1 x2 x2 x2)"
                    >
                      <Link
                        href="https://google.com"
                        newTab
                        mode={mode}
                        color={color}
                        icon={InformationCircleIcon}
                        counter={99}
                        disabled
                      >
                        Example label
                      </Link>
                    </div>
                  </>
                ))}
              </>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Default = Template.bind({});
