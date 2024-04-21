import React from "react";

interface SkewedImageContainerProps {
  children: React.ReactNode;
  imgSrc: string;
  imgProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    [data: string]: string;
  };
}

const SkewedImageContainer = ({
  children,
  imgSrc,
  imgProps,
}: SkewedImageContainerProps) => {
  return (
    <div className="relative z-40">
      <div className="absolute h-full w-full -skew-y-3 overflow-hidden bg-black">
        <div
          className="absolute -top-12 h-[calc(100%+3rem)] w-full skew-y-3 bg-[length:auto_50vh] bg-no-repeat sm:bg-[length:auto_60vh] md:bg-[length:auto_110%]"
          {...imgProps}
          style={{
            backgroundImage: `url('${imgSrc}')`,
          }}
        />
        <div
          data-h2-background="base(main-linear)"
          className="absolute left-0 right-0 top-0 block h-6"
        />
        <div
          data-h2-background="base(main-linear)"
          className="absolute bottom-0 left-0 right-0 block h-6"
        />
      </div>
      <div
        className="relative"
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div className="pb-[50vh] pt-24 sm:pb-[60vh] sm:pt-32 md:pb-36 md:pt-40">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SkewedImageContainer;
