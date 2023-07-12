import React from "react";

interface SkewedImageContainerProps {
  children: React.ReactNode;
  imgSrc: string;
}

const SkewedImageContainer = ({
  children,
  imgSrc,
}: SkewedImageContainerProps) => (
  <div
    data-h2-background-color="base(white) base:dark(black.light)"
    data-h2-layer="base(3, relative)"
  >
    <div
      data-h2-height="base(100%)"
      data-h2-width="base(100%)"
      data-h2-background-color="base(black.darkest)"
      data-h2-position="base(absolute)"
      data-h2-transform="base(skewY(-3deg))"
      data-h2-overflow="base(hidden)"
    >
      <div
        data-h2-position="base(absolute)"
        data-h2-transform="base(skewY(3deg))"
        data-h2-height="base(100%)"
        data-h2-width="base(100%)"
        className="profile-bg-image"
        style={{
          backgroundImage: `url('${imgSrc}')`,
        }}
      />
      <div
        data-h2-background="base(main-linear)"
        data-h2-location="base(0, 0, auto, 0)"
        data-h2-display="base(block)"
        data-h2-height="base(x1)"
        data-h2-position="base(absolute)"
      />
      <div
        data-h2-background="base(main-linear)"
        data-h2-location="base(auto, 0, 0, 0)"
        data-h2-display="base(block)"
        data-h2-height="base(x1)"
        data-h2-position="base(absolute)"
      />
    </div>
    <div
      data-h2-position="base(relative)"
      data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
    >
      <div data-h2-padding="base(x4, 0, 50vh, 0) p-tablet(x5, 0, 60vh, 0) l-tablet(x7, 0, x6, 0)">
        {children}
      </div>
    </div>
  </div>
);

export default SkewedImageContainer;
