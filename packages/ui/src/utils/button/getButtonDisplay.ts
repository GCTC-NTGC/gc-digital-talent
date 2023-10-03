import { ButtonLinkMode } from "../../types";

interface ButtonDisplayInterface {
  mode: ButtonLinkMode;
  block: boolean;
}

type ButtonDisplay = (args: ButtonDisplayInterface) => Record<string, string>;

const getDisplay: ButtonDisplay = ({ mode, block }) => {
  if (mode === "cta") {
    return {
      "data-h2-display":
        "base(inline-flex) base:children[>span:first-child](flex)",
    };
  }
  if (block) {
    return {
      "data-h2-display": "base(block)",
    };
  }
  return {
    "data-h2-display": "base(inline-block)",
  };
};

export default getDisplay;
