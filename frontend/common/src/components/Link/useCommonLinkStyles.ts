import type { LinkProps } from "./Link";
import { colorMap } from "../Button/Button";

interface CommonLinkStyleArgs
  extends Pick<LinkProps, "color" | "mode" | "block" | "type"> {
  disabled?: boolean;
}

const useCommonLinkStyles = ({
  color,
  mode,
  block,
  type,
  disabled,
}: CommonLinkStyleArgs) => {
  return type === "button"
    ? {
        "data-h2-radius": "base(s)",
        "data-h2-padding": "base(x.5, x1)",
        "data-h2-font-size": "base(copy)",
        ...(disabled && { style: { opacity: 0.6, pointerEvents: "none" } }),
        ...(color && mode ? { ...colorMap[color][mode] } : {}),
        ...(block
          ? {
              "data-h2-display": "base(block)",
              "data-h2-text-align": "base(center)",
            }
          : { "data-h2-display": "base(inline-block)" }),
      }
    : {};
};

export default useCommonLinkStyles;
