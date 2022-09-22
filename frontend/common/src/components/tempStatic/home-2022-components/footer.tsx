// Vendor dependencies
import React from "react";

// Local helper dependencies

// Local assets
// @ts-ignore
import logoLight from "../images/canada-logo-light.svg";
// @ts-ignore
import logoDark from "../images/canada-logo-dark.svg";

// Local component dependencies

// Create the page component
const Footer: React.FunctionComponent = () => {
  const footerLinks = [
    {
      path: "",
      title: "",
      label: "Feedback",
    },
    {
      path: "",
      title: "",
      label: "Terms and conditions",
    },
    {
      path: "",
      title: "",
      label: "Privacy policy",
    },
    {
      path: "",
      title: "",
      label: "Canada.ca",
    },
  ];
  return (
    <footer
      data-h2-background-color="base(black.lightest.1) base:dark(black.light)"
      data-h2-border="base(top, 1px, solid, black.2)"
      data-h2-padding="base(x2, 0)"
    >
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr)"
          data-h2-gap="base(x1) p-tablet(x2)"
          data-h2-align-items="base(center)"
        >
          <div data-h2-text-align="base(center) p-tablet(left)">
            <div
              data-h2-display="base(flex)"
              data-h2-gap="base(x1)"
              data-h2-flex-direction="base(column) p-tablet(row)"
              data-h2-flex-wrap="p-tablet(wrap)"
            >
              {footerLinks.map((item) => (
                <a
                  key=""
                  href={item.path}
                  title={item.title}
                  data-h2-background-color="base:focus-visible(focus)"
                  data-h2-outline="base(none)"
                  data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div data-h2-margin="base(x2, 0, x1, 0) p-tablet(x1, 0, 0, 0)">
              <p
                data-h2-color="base(black.7) base:dark(white.7)"
                data-h2-font-size="base(caption)"
              >
                Last modified: September 16th, 2022
              </p>
            </div>
          </div>
          <div data-h2-text-align="base(center) p-tablet(right)">
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
                  data-h2-max-width="base(x10)"
                />
              </div>
              <div data-h2-display="base(none) base:dark(block)">
                <img
                  src={logoDark}
                  alt="Government of Canada"
                  data-h2-max-width="base(x10)"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Export the component
export default Footer;
