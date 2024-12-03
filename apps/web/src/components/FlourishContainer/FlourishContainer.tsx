import { ReactNode } from "react";

import { useTheme } from "@gc-digital-talent/theme";

import desktopGraphicsLight2 from "~/assets/img/Desktop_Graphics_light_2.webp";
import desktopGraphicsLight3 from "~/assets/img/Desktop_Graphics_light_3.webp";
import desktopGraphicsDark2 from "~/assets/img/Desktop_Graphics_dark_2.webp";
import desktopGraphicsDark3 from "~/assets/img/Desktop_Graphics_dark_3.webp";

type Side = "top" | "bottom";
type Size = "sm" | "lg";

interface FlourishContainerProps {
  children: ReactNode;
  show?: Side[];
  size?: Size;
  skew?: boolean;
}

const FlourishContainer = ({
  children,
  show = ["top", "bottom"],
  size = "lg",
  skew = true,
}: FlourishContainerProps) => {
  const { mode } = useTheme();
  return (
    <div data-h2-layer="base(3, relative)">
      <div
        data-h2-background="base(background)"
        data-h2-height="base(100%)"
        data-h2-width="base(100%)"
        data-h2-position="base(absolute)"
        {...(skew && {
          "data-h2-transform": "base(skewY(-3deg))",
        })}
        data-h2-overflow="base(hidden)"
      >
        {show.includes("top") && (
          <img
            data-h2-position="base(absolute)"
            data-h2-location="base(0, 0, auto, auto)"
            data-h2-transform="base(skew(3deg))"
            data-h2-max-width="base(initial)"
            {...(size === "lg"
              ? {
                  "data-h2-height": "base(auto) p-tablet(50%)",
                  "data-h2-width": "base(150%) p-tablet(auto)",
                }
              : {
                  "data-h2-height": "base(auto) p-tablet(20%)",
                  "data-h2-width": "base(60%) p-tablet(auto)",
                })}
            src={mode === "dark" ? desktopGraphicsDark2 : desktopGraphicsLight2}
            alt=""
          />
        )}
        {show.includes("bottom") && (
          <img
            data-h2-position="base(absolute)"
            data-h2-location="base(auto, auto, 0, 0)"
            data-h2-transform="base(skew(3deg))"
            data-h2-max-width="base(initial)"
            {...(size === "lg"
              ? {
                  "data-h2-height": "base(auto) desktop(90%)",
                  "data-h2-width": "base(150%) p-tablet(100%) desktop(auto)",
                }
              : {
                  "data-h2-height": "base(auto) desktop(30%)",
                  "data-h2-width": "base(45%) p-tablet(32%) desktop(auto)",
                })}
            src={mode === "dark" ? desktopGraphicsDark3 : desktopGraphicsLight3}
            alt=""
          />
        )}
      </div>
      <div
        data-h2-position="base(relative)"
        data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div data-h2-padding="base(x3, 0) p-tablet(x5, 0, x4, 0) l-tablet(x7, 0, x6, 0)">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FlourishContainer;
