import React from "react";
import { StoryFn } from "@storybook/react";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";

import { ButtonLinkMode, Color } from "../../types";
import Button from "./Button";
import type { ButtonProps } from "./Button";

export default {
  component: Button,
  title: "Components/Button",
  args: {
    label: "Button label",
  },
  argTypes: {
    label: {
      name: "label",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
    onClick: {
      table: {
        disable: true,
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
  "icon_only",
];

const themes: Array<string> = ["light", "dark", "light iap", "dark iap"];

const Template: StoryFn<
  Omit<ButtonProps, "color" | "ref"> & { label: string }
> = () => {
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
                        "data-h2-font-color": "base(white)",
                      })}
                      {...(color !== "white" && {
                        "data-h2-background-color": "base(background)",
                        "data-h2-font-color": "base(black)",
                      })}
                      data-h2-padding="base(x2 x2 x1 x2)"
                    >
                      <Button
                        mode={mode}
                        color={color}
                        icon={InformationCircleIcon}
                        counter={99}
                        aria-label={
                          mode === "icon_only" ? "Example label" : undefined
                        }
                      >
                        Example label
                      </Button>
                      <p>{`${theme} ${mode} ${color}`}</p>
                    </div>
                    <div
                      key=""
                      {...(color === "white" && {
                        "data-h2-background-color": "base(black)",
                        "data-h2-font-color": "base(white)",
                      })}
                      {...(color !== "white" && {
                        "data-h2-background-color": "base(background)",
                        "data-h2-font-color": "base(black)",
                      })}
                      data-h2-padding="base(x1 x2 x2 x2)"
                    >
                      <Button
                        mode={mode}
                        color={color}
                        icon={InformationCircleIcon}
                        counter={99}
                        aria-label={
                          mode === "icon_only" ? "Example label" : undefined
                        }
                        disabled
                      >
                        Example label
                      </Button>
                      <p>{`${theme} ${mode} ${color} disabled`}</p>
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
