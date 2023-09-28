import { ButtonLinkMode } from "../../types";

interface ButtonFontWeightInterface {
  mode: ButtonLinkMode;
}

type ButtonFontWeight = (
  args: ButtonFontWeightInterface,
) => Record<string, string>;

const getFontWeight: ButtonFontWeight = ({ mode }) => {
  if (mode === "text") {
    return {
      "data-h2-font-weight": "base(400)",
    };
  }
  return {
    "data-h2-font-weight": "base(700)",
  };
};

export default getFontWeight;
