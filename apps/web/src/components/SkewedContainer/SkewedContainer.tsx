import React from "react";

import { useTheme } from "@gc-digital-talent/theme";

import desktopGraphicsLight1 from "~/assets/img/Desktop_Graphics_light_1.webp";
import desktopGraphicsDark1 from "~/assets/img/Desktop_Graphics_dark_1.webp";

interface SkewedContainerProps {
  children: React.ReactNode;
}

const SkewedContainer = ({ children }: SkewedContainerProps) => {
  const { mode } = useTheme();
  return (
    <div className="relative z-20 mt-[-3%]">
      <div
        className="absolute h-full w-full -skew-y-3 overflow-hidden"
        data-h2-background-color="base(background)"
      >
        <img
          className="skew-3 absolute right-0 top-0 h-auto w-[250%] translate-x-[32%] translate-y-[-52%] md:w-2/5 md:translate-x-0 md:translate-y-0"
          src={mode === "dark" ? desktopGraphicsDark1 : desktopGraphicsLight1}
          alt=""
        />
        <div
          data-h2-background="base(main-linear)"
          className="absolute left-0 right-0 top-0 block h-6"
        />
      </div>
      <div
        className="relative"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div className="py-20 sm:pb-36 sm:pt-40 md:pb-40 md:pt-48">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SkewedContainer;
