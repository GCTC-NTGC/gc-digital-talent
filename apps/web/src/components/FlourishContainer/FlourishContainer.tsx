import React from "react";
import { useImage } from "react-image";

import desktopGraphicsLight2 from "~/assets/img/Desktop_Graphics_light_2.png";
import deskTopGraphicsLight2Webp from "~/assets/img/webp/Desktop_Graphics_light_2.webp";
import desktopGraphicsLight3 from "~/assets/img/Desktop_Graphics_light_3.png";
import deskTopGraphicsLight3Webp from "~/assets/img/webp/Desktop_Graphics_light_3.webp";
import desktopGraphicsDark2 from "~/assets/img/Desktop_Graphics_dark_2.png";
import deskTopGraphicsDark2Webp from "~/assets/img/webp/Desktop_Graphics_dark_2.webp";
import desktopGraphicsDark3 from "~/assets/img/Desktop_Graphics_dark_3.png";
import deskTopGraphicsDark3Webp from "~/assets/img/webp/Desktop_Graphics_dark_3.webp";

type Side = "top" | "bottom";
type Size = "sm" | "lg";

interface ReactImageProps {
  UrlArray: string[];
  size: Size;
}

const ReactImageTop = ({
  UrlArray,
  size,
  imageCase,
}: ReactImageProps & { imageCase: "light" | "dark" }) => {
  const { src } = useImage({
    srcList: UrlArray,
  });

  return (
    <img
      src={src}
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
      alt=""
      data-h2-display={
        imageCase === "light"
          ? "base(block) base:dark(none)"
          : "base(none) base:dark(block)"
      }
    />
  );
};

const ReactImageBottomLight = ({ UrlArray, size }: ReactImageProps) => {
  const { src } = useImage({
    srcList: UrlArray,
  });

  return (
    <img
      src={src}
      data-h2-display="base(block) base:dark(none)"
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
      alt=""
    />
  );
};

const ReactImageBottomDark = ({
  UrlArray,
}: Pick<ReactImageProps, "UrlArray">) => {
  const { src } = useImage({
    srcList: UrlArray,
  });

  return (
    <img
      src={src}
      data-h2-display="base(none) base:dark(block)"
      data-h2-position="base(absolute)"
      data-h2-location="base(auto, auto, 0, 0)"
      data-h2-transform="base(skew(3deg))"
      data-h2-height="base(auto) desktop(90%)"
      data-h2-width="base(150%) p-tablet(100%) desktop(auto)"
      data-h2-max-width="base(initial)"
      alt=""
    />
  );
};

interface FlourishContainerProps {
  children: React.ReactNode;
  show?: Array<Side>;
  size?: Size;
  skew?: boolean;
}

const FlourishContainer = ({
  children,
  show = ["top", "bottom"],
  size = "lg",
  skew = true,
}: FlourishContainerProps) => (
  <div data-h2-layer="base(2, relative)">
    <div
      data-h2-height="base(100%)"
      data-h2-width="base(100%)"
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-position="base(absolute)"
      {...(skew && {
        "data-h2-transform": "base(skewY(-3deg))",
      })}
      data-h2-overflow="base(hidden)"
    >
      {show.includes("top") && (
        <>
          <ReactImageTop
            UrlArray={[deskTopGraphicsLight2Webp, desktopGraphicsLight2]}
            size={size}
            imageCase="light"
          />
          <ReactImageTop
            UrlArray={[deskTopGraphicsDark2Webp, desktopGraphicsDark2]}
            size={size}
            imageCase="dark"
          />
        </>
      )}
      {show.includes("bottom") && (
        <>
          <ReactImageBottomLight
            UrlArray={[deskTopGraphicsLight3Webp, desktopGraphicsLight3]}
            size={size}
          />
          <ReactImageBottomDark
            UrlArray={[deskTopGraphicsDark3Webp, desktopGraphicsDark3]}
          />
        </>
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

export default FlourishContainer;
