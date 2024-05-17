import { ReactNode } from "react";

import { useTheme } from "@gc-digital-talent/theme";
import { cn } from "@gc-digital-talent/ui";

import desktopGraphicsLight2 from "~/assets/img/Desktop_Graphics_light_2.webp";
import desktopGraphicsLight3 from "~/assets/img/Desktop_Graphics_light_3.webp";
import desktopGraphicsDark2 from "~/assets/img/Desktop_Graphics_dark_2.webp";
import desktopGraphicsDark3 from "~/assets/img/Desktop_Graphics_dark_3.webp";

type Side = "top" | "bottom";
type Size = "sm" | "lg";

interface FlourishContainerProps {
  children: ReactNode;
  show?: Array<Side>;
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
    <div className="relative z-30">
      <div
        data-h2-background="base(background)"
        className={cn("absolute h-full w-full overflow-hidden", {
          "-skew-y-3": skew,
        })}
      >
        {show.includes("top") && (
          <img
            className={cn("absolute bottom-auto right-auto skew-x-3 skew-y-3", {
              "h-auto w-[150%] sm:h-[20%] sm:w-auto": size === "lg",
              "h-auto w-[60%] sm:h-1/2 sm:w-auto": size !== "sm",
            })}
            src={mode === "dark" ? desktopGraphicsDark2 : desktopGraphicsLight2}
            alt=""
          />
        )}
        {show.includes("bottom") && (
          <img
            className={cn("absolute left-auto top-auto skew-x-3 skew-y-3", {
              "h-auto w-[150%] sm:w-full md:w-auto lg:h-[90%]": size === "lg",
              "h-auto w-[45%] sm:w-[32%] lg:h-[30%] lg:w-auto": size !== "sm",
            })}
            src={mode === "dark" ? desktopGraphicsDark3 : desktopGraphicsLight3}
            alt=""
          />
        )}
      </div>
      <div
        data-h2-position="base(relative)"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div data-h2-padding="base(x3, 0) p-tablet(x5, 0, x4, 0) l-tablet(x7, 0, x6, 0)">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FlourishContainer;
