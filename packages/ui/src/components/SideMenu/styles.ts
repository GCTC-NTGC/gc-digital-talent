/* eslint-disable import/prefer-default-export */
export const commonStyles = {
  "data-h2-background-color": `
    base(transparent)
    base:focus-visible(focus)

    base:iap(secondary.light)
    base:iap:focus-visible(focus)
  `,
  "data-h2-outline": "base(none)",
  "data-h2-cursor": "base(pointer)",
  "data-h2-color": `
    base:all(white)
    base:all:hover(secondary.lighter)
    base:all:selectors[.active](secondary.lighter)

    base:all:focus-visible(black)
    base:all:iap:focus-visible(black)
  `,
  "data-h2-width": "base(100%)",
  "data-h2-text-align": "base(left)",
  "data-h2-text-decoration":
    "base:children[span]:selectors[:not(.active)](underline)",
  "data-h2-display": "base(block)",
  "data-h2-font-weight": "base:selectors[.active](700)",
  "data-h2-padding": "base(0)",
};
