import React from "react";

interface HomeHeroProps {
  children: React.ReactNode;
  callToAction?: React.ReactNode;
  img: {
    src: string;
    alt: string;
  };
}

const HomeHero = ({
  img: { src, alt },
  callToAction,
  children,
}: HomeHeroProps) => (
  <div
    data-h2-background-color="base(black.darkest)"
    data-h2-position="base(relative)"
    data-h2-padding-top="base(x3) p-tablet(x4) l-tablet(x6)"
    data-h2-padding-bottom="base(calc(50vh + 3%)) p-tablet(calc(60vh + 3%)) l-tablet(calc((6rem * var(--h2-line-height-copy)) + 3%))"
    data-h2-overflow="base(hidden)"
  >
    <div
      data-h2-position="base(relative)"
      data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      data-h2-layer="base(1, relative)"
    >
      <div
        data-h2-color="base(white)"
        data-h2-text-align="base(center) p-tablet(left)"
      >
        {children}
      </div>
      {callToAction ? (
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(flex-start)"
          data-h2-gap="base(x1)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
          data-h2-flex-wrap="base(wrap) p-tablet(initial)"
        >
          {callToAction}
        </div>
      ) : null}
    </div>
    <img
      alt={alt}
      src={src}
      data-h2-position="base(absolute)"
      data-h2-height="base(50vh) p-tablet(60vh) l-tablet(110%)"
      data-h2-width="base(auto)"
      data-h2-left="base(50%) l-tablet(60%)"
      data-h2-top="p-tablet(50%) l-tablet(0)"
      data-h2-bottom="base(-7%)"
      data-h2-transform="base(translate(-50%)) l-tablet(translate(-30%))"
      data-h2-max-width="base(200%) p-tablet(100%)"
    />
  </div>
);

export default HomeHero;
