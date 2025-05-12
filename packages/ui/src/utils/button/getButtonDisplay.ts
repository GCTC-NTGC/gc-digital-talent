import { ButtonLinkMode } from "../../types";

interface ButtonDisplayInterface {
  mode: ButtonLinkMode;
  block: boolean;
}

type ButtonDisplay = (
  args: ButtonDisplayInterface,
) => Record<string, string | undefined>;

const getDisplay: ButtonDisplay = ({ mode, block }) => {
  if (mode === "cta") {
    return {
      "data-h2-display":
        "base(inline-flex) base:children[>span:first-child](flex)",
    };
  }
  if (block) {
    return {
      "data-h2-display": "base(flex)",
      "data-h2-justify-content": "base(center)",
      "data-h2-width": "base(100%)",
    };
  }
  if (mode === "text") {
    return {
      "data-h2-display": "base(inline-flex)",
    };
  }
  return {
    "data-h2-display": "base(inline-block)",
  };
};

export default getDisplay;
