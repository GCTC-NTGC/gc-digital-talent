import { ReactNode } from "react";

import { useTheme } from "@gc-digital-talent/theme";

import desktopGraphicsLight1 from "~/assets/img/Desktop_Graphics_light_1.webp";
import desktopGraphicsDark1 from "~/assets/img/Desktop_Graphics_dark_1.webp";

interface SkewedContainerProps {
  children: ReactNode;
}

const SkewedContainer = ({ children }: SkewedContainerProps) => {
  const { mode } = useTheme();
  return (
    <div data-h2-margin="base(-3%, 0, 0, 0)" data-h2-layer="base(2, relative)">
      <div
        data-h2-height="base(100%)"
        data-h2-width="base(100%)"
        data-h2-background-color="base(background)"
        data-h2-position="base(absolute)"
        data-h2-transform="base(skewY(-3deg))"
        data-h2-overflow="base(hidden)"
      >
        <img
          data-h2-position="base(absolute)"
          data-h2-location="base(0, 0, auto, auto)"
          data-h2-transform="base(translate(32%, -52%) skew(3deg)) l-tablet(translate(0, 0) skew(3deg))"
          data-h2-height="base(auto)"
          data-h2-width="base(250%) l-tablet(40%)"
          data-h2-max-width="base(initial)"
          src={mode === "dark" ? desktopGraphicsDark1 : desktopGraphicsLight1}
          alt=""
        />
        <div
          data-h2-background="base(main-linear)"
          data-h2-location="base(0, 0, auto, 0)"
          data-h2-display="base(block)"
          data-h2-height="base(x1)"
          data-h2-position="base(absolute)"
        />
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

export default SkewedContainer;
