import React from "react";
import { useIntl } from "react-intl";
import ComputerDesktopIcon from "@heroicons/react/24/solid/ComputerDesktopIcon";
import SunIcon from "@heroicons/react/24/solid/SunIcon";
import MoonIcon from "@heroicons/react/24/solid/MoonIcon";

import { ToggleGroup } from "@gc-digital-talent/ui";
import { useTheme } from "@gc-digital-talent/theme";

const Beta = () => {
  const intl = useIntl();

  return (
    <span
      data-h2-font-size="base(caption)"
      data-h2-font-weight="base(700)"
      data-h2-text-transform="base(uppercase)"
    >
      {intl.formatMessage({
        defaultMessage: "Beta",
        id: "RTR3mh",
        description: "Label to indicate a feature is in beta",
      })}
    </span>
  );
};

const ThemeSwitcher = () => {
  const intl = useIntl();
  const { setMode, fullMode } = useTheme();

  const groupLabel = intl.formatMessage({
    defaultMessage: "Theme colour mode switcher",
    id: "Wwb8Lb",
    description:
      "Label for the group of buttons to change the current colour mode",
  });

  return (
    <ToggleGroup.Root
      type="single"
      color="secondary"
      value={fullMode}
      onValueChange={setMode}
      aria-label={groupLabel}
      label={<Beta />}
    >
      <ToggleGroup.Item
        value="pref"
        aria-label={intl.formatMessage({
          defaultMessage:
            "Allow your browser preferences to dictate the website's theme.",
          id: "56WpMU",
          description: "Button text to set no theme mode",
        })}
      >
        <ComputerDesktopIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="light"
        aria-label={intl.formatMessage({
          defaultMessage: "Activate light mode",
          id: "9nJi0W",
          description: "Button text to set theme mode to light",
        })}
      >
        <SunIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value="dark"
        aria-label={intl.formatMessage({
          defaultMessage: "Activate dark mode",
          id: "6wCHq2",
          description: "Button text to set theme mode to dark",
        })}
      >
        <MoonIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};

export default ThemeSwitcher;
