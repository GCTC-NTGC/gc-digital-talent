import React from "react";
import { useIntl } from "react-intl";

import { imageUrl } from "@common/helpers/router";

import Heading from "@common/components/Heading";
import TALENTSEARCH_APP_DIR from "../../../../talentSearchConstants";

import Block from "./Block";

// Create the page component
const Featured = () => {
  const intl = useIntl();
  // This array is just a temporary data object representing the content required by the feature blocks. This data will need to be migrated to wherever makes sense, and we'll also need dynamic routes and translated strings
  const featured = [
    {
      key: "pride",
      title: intl.formatMessage({
        defaultMessage: "Pride in tech",
        id: "muwFhL",
        description: "Title for the pride in tech featured item",
      }),
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis. ",
      img: {
        path: "https://images.unsplash.com/photo-1513677341490-f92c141c9d7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      },
      link: {
        path: "#", // TO DO: Update link when page created
        label: intl.formatMessage({
          defaultMessage: "Learn more<hidden> about pride in tech</hidden>",
          id: "jefAOX",
          description: "Link text to learn about pride in tech",
        }),
      },
    },
    {
      key: "women",
      title: intl.formatMessage({
        defaultMessage: "Women in STEM",
        id: "oMSsJd",
        description: "Title for the Women in STEM feature item",
      }),
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis. ",
      img: {
        path: "https://images.unsplash.com/photo-1571844305128-244233caa679?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
      },
      link: {
        path: "#", // TO DO: Update link when page created
        label: intl.formatMessage({
          defaultMessage: "Learn more<hidden> about women in STEM</hidden>",
          id: "MUpqIp",
          description: "Link text to learn more about women in STEM",
        }),
      },
    },
  ];
  // Return the component
  return (
    <div data-h2-layer="base(2, relative)">
      <div
        data-h2-height="base(100%)"
        data-h2-width="base(100%)"
        data-h2-background-color="base(white) base:dark(black.light)"
        data-h2-position="base(absolute)"
        data-h2-transform="base(skewY(-3deg))"
        data-h2-overflow="base(hidden)"
      >
        <img
          data-h2-display="base(block) base:dark(none)"
          data-h2-position="base(absolute)"
          data-h2-offset="base(0, 0, auto, auto)"
          data-h2-transform="base(skew(3deg))"
          data-h2-height="base(auto) p-tablet(50%)"
          data-h2-width="base(150%) p-tablet(auto)"
          data-h2-max-width="base(initial)"
          src={imageUrl(TALENTSEARCH_APP_DIR, "Desktop_Graphics_light_2.png")}
          alt=""
        />
        <img
          data-h2-display="base(none) base:dark(block)"
          data-h2-position="base(absolute)"
          data-h2-offset="base(0, 0, auto, auto)"
          data-h2-transform="base(skew(3deg))"
          data-h2-height="base(auto) p-tablet(50%)"
          data-h2-width="base(150%) p-tablet(auto)"
          data-h2-max-width="base(initial)"
          src={imageUrl(TALENTSEARCH_APP_DIR, "Desktop_Graphics_dark_2.png")}
          alt=""
        />
        <img
          data-h2-display="base(block) base:dark(none)"
          data-h2-position="base(absolute)"
          data-h2-offset="base(auto, auto, 0, 0)"
          data-h2-transform="base(skew(3deg))"
          data-h2-height="base(auto) desktop(90%)"
          data-h2-width="base(150%) p-tablet(100%) desktop(auto)"
          data-h2-max-width="base(initial)"
          src={imageUrl(TALENTSEARCH_APP_DIR, "Desktop_Graphics_light_3.png")}
          alt=""
        />
        <img
          data-h2-display="base(none) base:dark(block)"
          data-h2-position="base(absolute)"
          data-h2-offset="base(auto, auto, 0, 0)"
          data-h2-transform="base(skew(3deg))"
          data-h2-height="base(auto) desktop(90%)"
          data-h2-width="base(150%) p-tablet(100%) desktop(auto)"
          data-h2-max-width="base(initial)"
          src={imageUrl(TALENTSEARCH_APP_DIR, "Desktop_Graphics_dark_3.png")}
          alt=""
        />
      </div>
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div data-h2-padding="base(x3, 0) p-tablet(x5, 0, x4, 0) l-tablet(x7, 0, x6, 0)">
          <Heading level="h2" data-h2-margin="base(0, 0, x0.5, 0)">
            {intl.formatMessage({
              defaultMessage: "Check it out",
              id: "1q/MmU",
              description: "Heading for featured items on the homepage",
            })}
          </Heading>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr)))"
            data-h2-gap="base(x1) p-tablet(x2) laptop(x3)"
            data-h2-padding="base(x2, 0, 0, 0)"
          >
            {featured.map((item) => (
              <Block key={item.key} content={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default Featured;
