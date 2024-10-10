import { ButtonLinkMode, Color } from "../../types";
import getBaseStyle from "./getButtonBaseStyle";
import getBackgroundColor from "./getButtonBackgroundColor";
import getBorderColor from "./getButtonBorderColor";
import getDisplay from "./getButtonDisplay";
import getFontColor from "./getButtonFontColor";
import getFontWeight from "./getButtonFontWeight";
import getShadow from "./getButtonShadow";

export interface ButtonStyleInterface {
  mode: ButtonLinkMode;
  color: Color;
  block: boolean;
  disabled?: boolean;
}

const getButtonStyle = ({
  mode,
  color,
  block = false,
  disabled = false,
}: ButtonStyleInterface) => {
  return {
    ...getBaseStyle({ mode }),
    ...getBackgroundColor({ mode, color, disabled }),
    ...getBorderColor({ mode, color, disabled }),
    ...getDisplay({ mode, block }),
    ...getFontColor({ mode, color, disabled }),
    ...getFontWeight({ mode }),
    ...getShadow({ mode, disabled }),
  };
};

export default getButtonStyle;
