import { StyleRecord } from "../types";

type UseInputStyles = (inputType?: "default" | "select") => StyleRecord;

const useInputStyles: UseInputStyles = (inputType) => {
  const defaults = {
    "data-h2-border-style": "base(solid)",
    "data-h2-border-width": "base(1px)",
    "data-h2-outline": "base(none) base:focus-visible(2px solid focus)",
    "data-h2-outline-offset": "base(2px)",
    "data-h2-radius": "base(rounded)",
    "data-h2-opacity": "base:selectors[::placeholder](.7)",
    "data-h2-color": "base(black) base:selectors[::placeholder](gray.darkest)",
  };
  let padding = { "data-h2-padding": "base(x.5)" };
  let selectIcon = {};
  if (inputType === "select") {
    padding = {
      "data-h2-padding": "base(x.5, x1.5, x.5, x.5)",
    };
    selectIcon = {
      "data-h2-appearance": "base(none)",
      "data-h2-background-image": `base(url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='rgba(86, 86, 90, 1)'><path stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/></svg>")) base:dark(url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='rgba(191, 191, 191, 1)'><path stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/></svg>"))`,
      "data-h2-background-repeat": "base(no-repeat)",
      "data-h2-background-position-x": "base(calc(100% - .75rem))",
      "data-h2-background-position-y": "base(x.7)",
      "data-h2-background-size": "base(1rem)",
    };
  }
  return { ...defaults, ...padding, ...selectIcon };
};

export const useInputStylesDeprecated: UseInputStyles = (inputType) => {
  const defaults = {
    "data-h2-border-style": "base(solid)",
    "data-h2-border-width": "base(1px)",
    "data-h2-outline": "base(none) base:focus-visible(2px solid focus)",
    "data-h2-outline-offset": "base(2px)",
    "data-h2-radius": "base(rounded)",
    "data-h2-opacity": "base:selectors[::placeholder](.7)",
    "data-h2-color": "base(black) base:selectors[::placeholder](gray.darkest)",
  };
  let padding = { "data-h2-padding": "base(x.5)" };
  let selectIcon = {};
  if (inputType === "select") {
    padding = {
      "data-h2-padding": "base(x.5, x1.5, x.5, x.5)",
    };
    selectIcon = {
      "data-h2-appearance": "base(none)",
      "data-h2-background-image": `base(url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='rgba(86, 86, 90, 1)'><path stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/></svg>")) base:dark(url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='rgba(191, 191, 191, 1)'><path stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/></svg>"))`,
      "data-h2-background-repeat": "base(no-repeat)",
      "data-h2-background-position-x": "base(calc(100% - .75rem))",
      "data-h2-background-position-y": "base(x.7)",
      "data-h2-background-size": "base(1rem)",
    };
  }
  return { ...defaults, ...padding, ...selectIcon };
};

export default useInputStyles;
