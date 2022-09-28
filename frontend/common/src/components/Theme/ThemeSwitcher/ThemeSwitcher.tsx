import React from "react";
import { useIntl } from "react-intl";

import { PrefIcon, MoonIcon, SunIcon } from "./Icons";
import useTheme from "../../../hooks/useTheme";

const ThemeSwitcher = () => {
  const intl = useIntl();
  const { mode, setMode } = useTheme();

  return (
    <div
      className={mode}
      data-h2-fill="
        base:children[#icon_pref *](tm-yellow.light)
        base:class[light]:children[#icon_pref *](black.lighter)
        base:class[dark]:children[#icon_pref *](white.dark)
        base:dark:children[#icon_pref *](tm-yellow.dark)
        base:children[#icon_sun *](black.lighter)
        base:class[light]:children[#icon_sun *](tm-yellow.light)
        base:class[dark]:children[#icon_sun *](white.dark)
        base:children[#icon_moon *](black.lighter)
        base:class[dark]:children[#icon_moon *](tm-yellow.dark)
        base:children[button:focus-visible #icon_pref *](black)
        base:children[button:focus-visible #icon_sun *](black)
        base:children[button:focus-visible #icon_moon *](black)"
      data-h2-transform="
        base:class[pref]:children[#highlight](translate(0, 0))
        base:class[light]:children[#highlight](translate(2rem, 0))
        base:class[dark]:children[#highlight](translate(4rem, 0))"
    >
      <div
        data-h2-border="base(all, 1px, solid, black.darker.2) base:dark(all, 1px, solid, white.2)"
        data-h2-radius="base(50px)"
        data-h2-padding="base(x.25)"
        data-h2-position="base(relative)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-gap="base(.25rem)"
          data-h2-height="base:children[>div](1.75rem)"
          data-h2-width="base:children[>div](1.75rem)"
          data-h2-background-color="base:children[>div](rgba(230, 230, 230, 1)) base:children[>div]:dark(white.1)"
          data-h2-radius="base:children[>div](circle)"
        >
          <div />
          <div />
          <div />
        </div>
        <div
          data-h2-position="base(absolute)"
          data-h2-offset="base(x.25, auto, auto, x.25)"
          data-h2-display="base(flex)"
          data-h2-gap="base(.25rem)"
        >
          <div
            id="highlight"
            data-h2-height="base(1.75rem)"
            data-h2-width="base(1.75rem)"
            data-h2-transition="base(transform, .2s, ease, 0s)"
            data-h2-background-color="base:dark(white) base(black)"
            data-h2-radius="base(circle)"
          />
        </div>
        <div
          data-h2-position="base(absolute) base:children[>button](relative)"
          data-h2-offset="base(x.25, auto, auto, x.25)"
          data-h2-display="base(flex) base:children[>button](block)"
          data-h2-gap="base(.25rem)"
          data-h2-cursor="base:children[>button](pointer)"
          data-h2-background-color="base:children[>button](transparent) base:children[>button:focus-visible](focus)"
          data-h2-outline="base:children[>button](none)"
          data-h2-height="base:children[>button](1.75rem)"
          data-h2-width="base:children[>button](1.75rem)"
          data-h2-radius="base:children[>button](circle)"
          data-h2-border="base:children[>button](none)"
          data-h2-padding="base:children[>button](0)"
        >
          <button type="button" onClick={() => setMode("pref")}>
            <PrefIcon />
            <span data-h2-visibility="base(invisible)">
              {intl.formatMessage({
                defaultMessage:
                  "Allow your browser preferences to dictate the website's theme.",
                id: "56WpMU",
                description: "Button text to set no theme mode",
              })}
            </span>
          </button>
          <button type="button" onClick={() => setMode("light")}>
            <SunIcon />
            <span data-h2-visibility="base(invisible)">
              {intl.formatMessage({
                defaultMessage: "Activate light mode",
                id: "9nJi0W",
                description: "Button text to set theme mode to light",
              })}
            </span>
          </button>
          <button
            type="button"
            title="Activate dark mode." // Requires a translated string
            onClick={() => setMode("dark")}
          >
            <MoonIcon />
            <span data-h2-visibility="base(invisible)">
              {intl.formatMessage({
                defaultMessage: "Activate dark mode",
                id: "6wCHq2",
                description: "Button text to set theme mode to dark",
              })}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
