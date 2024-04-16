import React from "react";
import { StoryFn } from "@storybook/react";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";

import { Color, ButtonLinkMode } from "../../types";
import Link from "./Link";
import DownloadCsv from "./DownloadCsv";
import type { LinkProps } from "./Link";

export default {
  component: Link,
  title: "Components/Link/DownloadCSV",
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
      >
        {themes.map((theme) => (
          <div key={theme} data-h2={theme}>
            {colors.map((color) => (
              <>
                {modes.map((mode) => (
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
                    <DownloadCsv
                      mode={mode}
                      color={color}
                      icon={InformationCircleIcon}
                      headers={[{ id: "test", displayName: "label" }]}
                      data={[{ key: "test", label: "label" }]}
                      fileName=""
                    >
                      Example label
                    </DownloadCsv>
                  </div>
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
