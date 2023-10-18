import { ButtonLinkMode } from "../../types";

interface ButtonShadowInterface {
  mode: ButtonLinkMode;
  disabled?: boolean;
}

type ButtonShadow = (args: ButtonShadowInterface) => Record<string, string>;

const getShadow: ButtonShadow = ({ mode, disabled }) => {
  if (mode === "cta") {
    if (disabled) {
      return {
        "data-h2-shadow": "base(medium)",
      };
    }
    return {
      "data-h2-shadow": "base(medium) base:hover(larger)",
    };
  }
  return {
    "data-h2-shadow": "base(none)",
  };
};

export default getShadow;
