import { ReactNode } from "react";

import { useTheme } from "@gc-digital-talent/theme";
import { Container, Flourish } from "@gc-digital-talent/ui";

import desktopGraphicsLight1 from "~/assets/img/Desktop_Graphics_light_1.webp";
import desktopGraphicsDark1 from "~/assets/img/Desktop_Graphics_dark_1.webp";

interface SkewedContainerProps {
  children: ReactNode;
}

const SkewedContainer = ({ children }: SkewedContainerProps) => {
  const { mode } = useTheme();
  return (
    <div className="relative z-[2] -mt-[3%]">
      <div className="absolute h-full w-full -skew-y-3 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          className="absolute top-0 right-0 h-auto w-[250%] translate-x-[32%] -translate-y-[52%] skew-3 sm:w-2/5 sm:translate-0"
          src={mode === "dark" ? desktopGraphicsDark1 : desktopGraphicsLight1}
          alt=""
        />
        <Flourish className="abosolute inset-0 bottom-auto" />
      </div>
      <Container className="relative">
        <div className="py-18 xs:pt-35 xs:pb-24 sm:pt-42 sm:pb-36">
          {children}
        </div>
      </Container>
    </div>
  );
};

export default SkewedContainer;
