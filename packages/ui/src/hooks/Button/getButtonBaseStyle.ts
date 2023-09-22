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
        "base(rounded) base:children[>div:first-child](rounded 0px 0px rounded) base:children[>div:last-child](0px rounded rounded 0px)",
      "data-h2-outline": "base(none)",
      "data-h2-transition":
        "base(all .2s ease) base:children[>div](all .2s ease)",
      "data-h2-border-width": "base:children[>div](3px)",
      "data-h2-border-style": "base:children[>div](solid)",
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
