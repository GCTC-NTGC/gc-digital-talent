import { ReactNode } from "react";
import { tv } from "tailwind-variants";

import { useTheme } from "@gc-digital-talent/theme";
import { Container } from "@gc-digital-talent/ui";

import desktopGraphicsLight2 from "~/assets/img/Desktop_Graphics_light_2.webp";
import desktopGraphicsLight3 from "~/assets/img/Desktop_Graphics_light_3.webp";
import desktopGraphicsDark2 from "~/assets/img/Desktop_Graphics_dark_2.webp";
import desktopGraphicsDark3 from "~/assets/img/Desktop_Graphics_dark_3.webp";

type Side = "top" | "bottom";
type Size = "sm" | "lg";

const flourishContainer = tv({
  slots: {
    layout: "absolute h-full w-full overflow-hidden bg-white dark:bg-gray-700",
    topImg: "top-0 right-0",
    bottomImg: "bottom-0 left-0",
  },
  variants: {
    skew: {
      true: {
        layout: "-skew-y-3",
      },
    },
    size: {
      sm: {
        topImg: "w-[60%] xs:h-1/5 xs:w-auto",
        bottomImg: "w-[45%] xs:w-[32%] xl:h-[30%] xl:w-auto",
      },
      lg: {
        topImg: "w-[150%] xs:h-1/2 xs:w-auto",
        bottomImg: "w-[150%] xs:w-full xl:h-[90%] xl:w-auto",
      },
    },
  },
  compoundSlots: [
    {
      slots: ["topImg", "bottomImg"],
      class: "max-w-initial absolute h-auto skew-3",
    },
  ],
});

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
  const { layout, topImg, bottomImg } = flourishContainer({ skew, size });
  return (
    <div className="relative z-[3]">
      <div className={layout()}>
        {show.includes("top") && (
          <img
            className={topImg()}
            src={mode === "dark" ? desktopGraphicsDark2 : desktopGraphicsLight2}
            alt=""
          />
        )}
        {show.includes("bottom") && (
          <img
            className={bottomImg()}
            src={mode === "dark" ? desktopGraphicsDark3 : desktopGraphicsLight3}
            alt=""
          />
        )}
      </div>
      <Container
        className="relative px-6 py-18 xs:px-12 xs:pt-35 xs:pb-24 sm:pt-42 sm:pb-36"
        size="lg"
        center
      >
        {children}
      </Container>
    </div>
  );
};

export default FlourishContainer;
