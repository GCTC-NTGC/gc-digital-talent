// GC Digital Talent / Common workspace / Static homepage / Navigation

// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local assets

// Local component dependencies

// Create the page component
const Navigation: React.FunctionComponent = () => {
  /* We'll likely want to update this layout to be more dynamic on mobile devices down the road. */
  return (
    <nav
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-padding="base(x1, 0)"
    >
      {/* Content container with a grid layout */}
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <div
          data-h2-grid-template-columns="base(1fr) p-tablet(2fr 1fr) laptop(1fr 1fr)"
          data-h2-align-items="base(center)"
          data-h2-display="base(grid) base:children[>ul](flex)"
          data-h2-gap="base(x1) p-tablet(x2) base:children[>ul](x1)"
          data-h2-list-style="base:children[>ul](none)"
          data-h2-padding="base:children[>ul](0)"
        >
          {/* Grid items in this case are <ul> element to help assistive tech understand volume */}
          <ul data-h2-justify-content="base(center) p-tablet(flex-start)">
            <li>
              <a
                href="/" // Dynamic route required
                title="Visit the GC Digital Talent homepage." // Translated string required
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
              >
                Home {/* Translated string required */}
              </a>
            </li>
            <li>
              <a
                href="/browse" // Dynamic route required
                title="Learn more about opportunities in the IT community." // Translated string required
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
              >
                Browse opportunities {/* Translated string required */}
              </a>
            </li>
            <li>
              <a
                href="/search" // Dynamic route required
                title="Find out how you can seek out and hire talent." // Translated string required
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
              >
                Hire talent {/* Translated string required */}
              </a>
            </li>
          </ul>
          {/* Second <ul> element for login, registration, logout, profile */}
          <ul data-h2-justify-content="base(center) p-tablet(flex-end)">
            <li>
              <a
                href="/register" // Dynamic route required
                title="Register for GC Digital Talent using GC Key." // Translated string required
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
              >
                Register {/* Translated string required */}
              </a>
            </li>
            <li>
              <a
                href="/login" // Dynamic route required
                title="Log in to an existing GC Digital Talent account using GC Key." // Translated string required
                data-h2-background-color="base:focus-visible(focus)"
                data-h2-outline="base(none)"
                data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
              >
                Login {/* Translated string required */}
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
