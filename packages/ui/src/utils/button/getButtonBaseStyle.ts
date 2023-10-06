import { ButtonLinkMode } from "../../types";

interface ButtonBaseStyleInterface {
  mode: ButtonLinkMode;
}

type ButtonBaseStyle = (
  args: ButtonBaseStyleInterface,
) => Record<string, string>;

const getBaseStyle: ButtonBaseStyle = ({ mode }) => {
  if (mode === "solid") {
    return {
      "data-h2-padding": "base(calc(x.5 - 3px) calc(x1 - 3px))",
      "data-h2-radius": "base(rounded)",
      "data-h2-outline": "base(none)",
      "data-h2-transition": "base(all .2s ease)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(solid)",
    };
  }
  if (mode === "placeholder") {
    return {
      "data-h2-padding": "base(calc(x.5 - 3px) calc(x1 - 3px))",
      "data-h2-radius": "base(rounded)",
      "data-h2-outline": "base(none)",
      "data-h2-transition": "base(all .2s ease)",
      "data-h2-border-width": "base(3px)",
      "data-h2-border-style": "base(dashed)",
    };
  }
  if (mode === "inline" || mode === "text") {
    return {
      "data-h2-padding": "base(0)",
      "data-h2-radius": "base(0)",
      "data-h2-outline": "base(none)",
      "data-h2-transition": "base(all .2s ease)",
      "data-h2-border-width": "base(0px)",
      "data-h2-border-style": "base(solid)",
    };
  }
  if (mode === "cta") {
    return {
      "data-h2-padding": "base(0)",
      "data-h2-radius":
        "base(rounded) base:children[>span:first-child](rounded 0px 0px rounded) base:children[>span:last-child](0px rounded rounded 0px)",
      "data-h2-outline": "base(none)",
      "data-h2-transition":
        "base(all .2s ease) base:children[>span](all .2s ease)",
      "data-h2-border-width": "base:children[>span](3px)",
      "data-h2-border-style": "base:children[>span](solid)",
    };
  }
  return {
    "data-h2-padding": "base(0)",
    "data-h2-radius": "base(0)",
    "data-h2-outline": "base(none)",
    "data-h2-transition": "base(all .2s ease)",
    "data-h2-border-width": "base(0px)",
    "data-h2-border-style": "base(solid)",
  };
};

export default getBaseStyle;
