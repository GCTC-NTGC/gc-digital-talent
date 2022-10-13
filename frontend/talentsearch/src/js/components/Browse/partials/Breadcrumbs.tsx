// This will be a common component for all pages

// Vendor dependencies
import React from "react";

// Local assets
import { imageUrl } from "@common/helpers/router";
import Flourish from "./Flourish";
import TALENTSEARCH_APP_DIR from "../../../talentSearchConstants";

const Chevron = imageUrl(TALENTSEARCH_APP_DIR, "chevron-right.svg");

// Example crumb data
const crumbs = [
  {
    label: "Home",
    title: "Visit the homepage.",
    url: "#ADD-A-PATH",
    separator: true,
    currentStyles: {},
  },
  {
    label: "Example parent",
    title: "This parent page is for illustrative purposes.",
    url: "#ADD-A-PATH",
    separator: true,
    currentStyles: {},
  },
  {
    label: "Browse IT jobs",
    title: "This is the current page.",
    url: "#ADD-A-PATH",
    separator: false,
    currentStyles: {
      "data-h2-font-weight": "base(700)",
      "data-h2-text-decoration": "base(none)",
    },
  },
];

// Create the page component
const Breadcrumbs = () => {
  return (
    <div>
      <div
        data-h2-background-color="base(black.80)"
        data-h2-color="base(white)"
        data-h2-padding="base(x1, 0)"
      >
        <nav
          data-h2-position="base(relative)"
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        >
          <ul
            data-h2-list-style="base(none)"
            data-h2-display="base(flex) base:children[>li](inline-block)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-gap="base(x.5)"
            data-h2-padding="base(0)"
          >
            {crumbs.map((crumb) => (
              // Needs proper key
              <li key="">
                <a
                  href={crumb.url}
                  title={crumb.title}
                  {...crumb.currentStyles}
                >
                  {crumb.label}
                </a>
                {crumb.separator ? (
                  <span
                    data-h2-display="base(inline-block)"
                    data-h2-margin="base(0, 0, 0, x.5)"
                  >
                    <img
                      src={Chevron}
                      // Alt text?
                      alt=""
                      data-h2-width="base(x1)"
                      data-h2-vertical-align="base(middle)"
                    />
                  </span>
                ) : (
                  ""
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Flourish />
    </div>
  );
};

// Export the component
export default Breadcrumbs;
