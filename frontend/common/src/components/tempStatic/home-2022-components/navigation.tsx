// Vendor dependencies
import React from "react";
import { useIntl } from "react-intl";

// Local helper dependencies

// Local component dependencies

// Create the page component
const Navigation: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <nav
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-padding="base(x1, 0)"
    >
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <div
          data-h2-grid-template-columns="base(1fr) p-tablet(2fr 1fr) laptop(1fr 1fr)"
          data-h2-align-items="base(center)"
          data-h2-display="base(grid) base:children[>ul](flex)"
          data-h2-gap="base(x1) p-tablet(x2) base:children[>ul](x1)"
          data-h2-list-style="base:children[>ul](none)"
          data-h2-padding="base:children[>ul](0)"
        >
          <ul data-h2-justify-content="base(center) p-tablet(flex-start)">
            <li>
              <a
                href=""
                title=""
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href=""
                title=""
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
              >
                Browse opportunities
              </a>
            </li>
            <li>
              <a
                href=""
                title=""
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
              >
                Hire talent
              </a>
            </li>
          </ul>
          <ul data-h2-justify-content="base(center) p-tablet(flex-end)">
            <li>
              <a
                href=""
                title=""
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
              >
                Register
              </a>
            </li>
            <li>
              <a
                href=""
                title=""
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Export the component
export default Navigation;
