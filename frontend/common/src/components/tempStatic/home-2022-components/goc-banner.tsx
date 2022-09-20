// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local assets
import logoLight from "../images/goc-logo-light.svg";
import logoDark from "../images/goc-logo-dark.svg";

// Local component dependencies
import ThemeSwitcher from "./theme-switcher";

// Create the page component
const Navigation: React.FunctionComponent = () => {
  return (
    <div
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-border="base(bottom, 1px, solid, black.2) base:dark(bottom, 1px, solid, white.2)"
      data-h2-padding="base(x1, 0) p-tablet(x.5, 0)"
    >
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr)"
          data-h2-gap="base(x.5) p-tablet(x2)"
          data-h2-align-items="base(center)"
        >
          <div data-h2-text-align="base(center) p-tablet(left)">
            <a
              href="https://canada.ca"
              target="_blank"
              title="Open canada.ca in a new tab."
              rel="noopener noreferrer"
            >
              <div data-h2-display="base(block) base:dark(none)">
                <img
                  src={logoLight}
                  alt="Government of Canada"
                  data-h2-max-width="base(x12) p-tablet(x15)"
                />
              </div>
              <div data-h2-display="base(none) base:dark(block)">
                <img
                  src={logoDark}
                  alt="Government of Canada"
                  data-h2-max-width="base(x12) p-tablet(x15)"
                />
              </div>
            </a>
          </div>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x.5) p-tablet(x1)"
            data-h2-align-items="base(center)"
            data-h2-justify-content="base(center) p-tablet(flex-end)"
            data-h2-text-align="base(center) p-tablet(left)"
          >
            <div>
              <ThemeSwitcher />
            </div>
            <div>
              <a
                href="https://google.com"
                title="Visitez cette page en français."
              >
                Français
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default Navigation;
