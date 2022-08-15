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
        "data-h2-radius": "b(s)",
        "data-h2-padding": "b(top-bottom, xs) b(right-left, s)",
        "data-h2-font-size": "b(caption) m(normal)",
        ...(disabled && { style: { opacity: 0.6, pointerEvents: "none" } }),
        ...(color && mode ? { ...colorMap[color][mode] } : {}),
        ...(block
          ? {
              "data-h2-display": "b(block)",
              "data-h2-text-align": "b(center)",
            }
          : { "data-h2-display": "b(inline-block)" }),
      }
    : {};
};

export default useCommonLinkStyles;
