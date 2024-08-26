import { ReactNode, DetailedHTMLProps, HTMLAttributes } from "react";

interface SkewedImageContainerProps {
  children: ReactNode;
  imgSrc: string;
  imgProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
    Record<string, string>;
}

const SkewedImageContainer = ({
  children,
  imgSrc,
  imgProps,
}: SkewedImageContainerProps) => {
  return (
    <div data-h2-layer="base(4, relative)">
      <div
        data-h2-height="base(100%)"
        data-h2-width="base(100%)"
        data-h2-background-color="base(#000)"
        data-h2-position="base(absolute)"
        data-h2-transform="base(skewY(-3deg))"
        data-h2-overflow="base(hidden)"
      >
        <div
          data-h2-position="base(absolute)"
          data-h2-transform="base(skewY(3deg))"
          data-h2-top="base(-3rem)"
          data-h2-height="base(calc(100% + 3rem))"
          data-h2-width="base(100%)"
          data-h2-background-repeat="base(no-repeat)"
          data-h2-background-size="base(auto 50vh) p-tablet(auto 60vh) l-tablet(auto 110%)"
          {...imgProps}
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
        data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div data-h2-padding="base(x4, 0, 50vh, 0) p-tablet(x5, 0, 60vh, 0) l-tablet(x7, 0, x6, 0)">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SkewedImageContainer;
