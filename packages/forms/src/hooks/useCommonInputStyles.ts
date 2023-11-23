import { StyleRecord } from "../types";

type UseCommonInputStyles = (type?: string) => StyleRecord;

const useCommonInputStyles: UseCommonInputStyles = (type) => {
  let defaults = {
    "data-h2-border-style": "base(solid)",
    "data-h2-border-width": "base(1px)",
    "data-h2-outline": "base(none) base:focus-visible(2px solid focus)",
    "data-h2-outline-offset": "base(2px)",
    "data-h2-radius": "base(rounded)",
    "data-h2-color": "base(black)",
    "data-h2-padding": "base(x.5)",
  };
  let selectIcon = {};
  if (type === "select") {
    selectIcon = {
      "data-h2-appearance": "base(none)",
      "data-h2-background-image": `base(url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")) base:dark(url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>"))`,
      "data-h2-background-repeat": "base(no-repeat)",
      "data-h2-background-position-x": "base(98%)",
      "data-h2-background-position-y": "base(x.5)",
    };
  }
  return { ...defaults, ...selectIcon };
};

export default useCommonInputStyles;
