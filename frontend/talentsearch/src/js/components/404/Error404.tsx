import React from "react";

import CallToAction from "../Home/partials/CallToAction";

import light404Image from "./assets/404_pug_light.svg";
import dark404Image from "./assets/404_pug_dark.svg";

const Error404 = () => (
  <div>
    <div
      data-h2-background-color="base(tm-linear-divider)"
      data-h2-display="base(block)"
      data-h2-height="base(x1)"
    />
    <div
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-color="base(black) base:dark(white)"
      data-h2-padding="base(x3, 0)"
    >
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-text-align="base(center)"
      >
        {/* Needs translation strings */}
        <h1 data-h2-font-size="base(h4, 1.4)" data-h2-font-weight="base(700)">
          Sorry eh! We can't find the page you were looking for.
        </h1>
        {/* Needs translation strings */}
        <img
          src={light404Image}
          alt=""
          data-h2-display="base(inline-block) base:dark(none)"
          data-h2-width="base(70%)"
        />
        {/* Needs translation strings */}
        <img
          src={dark404Image}
          alt=""
          data-h2-display="base(none) base:dark(inline-block)"
          data-h2-width="base(70%)"
        />
        {/* Needs translation strings */}
        <p data-h2-margin="base(x1, 0) p-tablet(0, 0, x3, 0)">
          It looks like you've landed on a page that either doesn't exist or has
          moved.
        </p>
        <div
          data-h2-display="base(flex)"
          data-h2-gap="base(x1)"
          data-h2-justify-content="base(center)"
          data-h2-flex-wrap="base(wrap) p-tablet(initial)"
        >
          <CallToAction
            type="link"
            context="home"
            content={{
              path: "path/to/home",
              label: "Go to the homepage",
            }}
          />
          <CallToAction
            type="link"
            context="support"
            content={{
              path: "path/to/support",
              label: "Report a missing page",
            }}
          />
        </div>
      </div>
    </div>
    <div
      data-h2-background-color="base(tm-linear-divider)"
      data-h2-display="base(block)"
      data-h2-height="base(x1)"
    />
  </div>
);

export default Error404;
