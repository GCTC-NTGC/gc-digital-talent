import React from "react";
import ArrowRightCircleIcon from "@heroicons/react/24/solid/ArrowRightCircleIcon";
import ArrowDownCircleIcon from "@heroicons/react/24/solid/ArrowDownCircleIcon";

export interface InstructionStepProps {
  image: string;
  imageDark?: string;
  includeArrow?: boolean;
  children: React.ReactNode;
}

export const InstructionStep = ({
  image,
  imageDark,
  includeArrow = true,
  children,
}: InstructionStepProps) => {
  let lightImage;
  let darkImage;

  if (image) {
    lightImage = <img data-h2-display="base(block)" src={image} alt="" />;
  }

  if (imageDark) {
    lightImage = (
      <img data-h2-display="base(block) base:dark(none)" src={image} alt="" />
    );
    darkImage = (
      <img
        data-h2-display="base(none) base:dark(block)"
        src={imageDark}
        alt=""
      />
    );
  }

  return (
    <li
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-flex-item="base(1of1) p-tablet(1of4)"
    >
      <div data-h2-display="base(flex)" data-h2-flex-direction="base(row)">
        {lightImage}
        {darkImage}
        {includeArrow && (
          <ArrowRightCircleIcon
            data-h2-display="base(none) p-tablet(block)"
            data-h2-vertical-align="base(middle)"
            data-h2-color="base:all(black.lighter)"
            data-h2-height="base(auto)"
            data-h2-width="base(x1.5)"
            data-h2-overflow="base(visible)"
            data-h2-padding="base(0, x0.25)"
          />
        )}
      </div>
      <div
        data-h2-flex-grow="base(1)"
        data-h2-flex="base(1)"
        data-h2-text-indent="base(-1em)"
        data-h2-padding-left="base(1em)"
        data-h2-margin="base(x.5, 0, 0, 0)"
      >
        {children}
      </div>
      {includeArrow && (
        <ArrowDownCircleIcon
          data-h2-display="base(block) p-tablet(none)"
          data-h2-color="base:all(black.lighter)"
          data-h2-height="base(auto)"
          data-h2-width="base(x1.5)"
          data-h2-margin="base(auto)"
          data-h2-padding="base(x0.5, 0)"
        />
      )}
    </li>
  );
};
