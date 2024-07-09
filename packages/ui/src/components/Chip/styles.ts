import { Color } from "../../types";

const colorMap = new Map<Color, Record<string, string>>([
  [
    "primary",
    {
      "data-h2-background-color": `
          base(primary.lightest)
          base:selectors[.Chip--dismissible:hover](primary.lighter)
          base:selectors[.Chip--dismissible:focus-visible](focus)
      `,
      "data-h2-color": `
        base(primary.darkest)
        base:selectors[.Chip--dismissible:focus-visible](black)
      `,
      "data-h2-border":
        "base(thin solid primary.darkest) base:selectors[.Chip--dismissible:focus-visible](thin solid black)",
    },
  ],
  [
    "secondary",
    {
      "data-h2-background-color": `
          base(secondary.lightest)
          base:selectors[.Chip--dismissible:hover](secondary.lighter)
          base:selectors[.Chip--dismissible:focus-visible](focus)
      `,
      "data-h2-color": `
        base(secondary.darkest)
        base:selectors[.Chip--dismissible:focus-visible](black)
      `,
      "data-h2-border":
        "base(thin solid secondary.darkest) base:selectors[.Chip--dismissible:focus-visible](thin solid black)",
    },
  ],
  [
    "tertiary",
    {
      "data-h2-background-color": `
          base(tertiary.lightest)
          base:selectors[.Chip--dismissible:hover](tertiary.lighter)
          base:selectors[.Chip--dismissible:focus-visible](focus)
      `,
      "data-h2-color": `
        base(tertiary.darkest)
        base:selectors[.Chip--dismissible:focus-visible](black)
      `,
      "data-h2-border":
        "base(thin solid tertiary.darkest) base:selectors[.Chip--dismissible:focus-visible](thin solid black)",
    },
  ],
  [
    "quaternary",
    {
      "data-h2-background-color": `
          base(quaternary.lightest)
          base:selectors[.Chip--dismissible:hover](quaternary.lighter)
          base:selectors[.Chip--dismissible:focus-visible](focus)
      `,
      "data-h2-color": `
        base(quaternary.darkest)
        base:selectors[.Chip--dismissible:focus-visible](black)
      `,
      "data-h2-border":
        "base(thin solid quaternary.darkest) base:selectors[.Chip--dismissible:focus-visible](thin solid black)",
    },
  ],
  [
    "quinary",
    {
      "data-h2-background-color": `
          base(quinary.lightest)
          base:selectors[.Chip--dismissible:hover](quinary.lighter)
          base:selectors[.Chip--dismissible:focus-visible](focus)
      `,
      "data-h2-color": `
        base(quinary.darkest)
        base:selectors[.Chip--dismissible:focus-visible](black)
      `,
      "data-h2-border":
        "base(thin solid quinary.darkest) base:selectors[.Chip--dismissible:focus-visible](thin solid black)",
    },
  ],
  [
    "error",
    {
      "data-h2-background-color": `
          base(error.lightest)
          base:selectors[.Chip--dismissible:hover](error.lighter)
          base:selectors[.Chip--dismissible:focus-visible](focus)
      `,
      "data-h2-color": `
        base(error.darkest)
        base:selectors[.Chip--dismissible:focus-visible](black)
      `,
      "data-h2-border":
        "base(thin solid error.darkest) base:selectors[.Chip--dismissible:focus-visible](thin solid black)",
    },
  ],
  [
    "warning",
    {
      "data-h2-background-color": `
          base(warning.lightest)
          base:selectors[.Chip--dismissible:hover](warning.lighter)
          base:selectors[.Chip--dismissible:focus-visible](focus)
      `,
      "data-h2-color": `
        base(warning.darkest)
        base:selectors[.Chip--dismissible:focus-visible](black)
      `,
      "data-h2-border":
        "base(thin solid warning.darkest) base:selectors[.Chip--dismissible:focus-visible](thin solid black)",
    },
  ],
  [
    "success",
    {
      "data-h2-background-color": `
          base(success.lightest)
          base:selectors[.Chip--dismissible:hover](success.lighter)
          base:selectors[.Chip--dismissible:focus-visible](focus)
      `,
      "data-h2-color": `
        base(success.darkest)
        base:selectors[.Chip--dismissible:focus-visible](black)
      `,
      "data-h2-border":
        "base(thin solid success.darkest) base:selectors[.Chip--dismissible:focus-visible](thin solid black)",
    },
  ],
  [
    "black",
    {
      "data-h2-background-color": `
          base(black.lightest)
          base:selectors[.Chip--dismissible:hover](black.lighter)
          base:selectors[.Chip--dismissible:focus-visible](focus)
      `,
      "data-h2-color": `
        base(black.darkest)
        base:selectors[.Chip--dismissible:focus-visible](black)
      `,
      "data-h2-border":
        "base(thin solid black.darkest) base:selectors[.Chip--dismissible:focus-visible](thin solid black)",
    },
  ],
]);

export default colorMap;
