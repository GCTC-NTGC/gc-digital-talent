import ArrowRightCircleIcon from "@heroicons/react/24/solid/ArrowRightCircleIcon";
import ArrowDownCircleIcon from "@heroicons/react/24/solid/ArrowDownCircleIcon";
import { ReactNode } from "react";

import { useTheme } from "@gc-digital-talent/theme";

interface InstructionStepProps {
  image: string;
  imageDark?: string;
  includeArrow?: boolean;
  children: ReactNode;
}

const InstructionStep = ({
  image,
  imageDark,
  includeArrow = true,
  children,
}: InstructionStepProps) => {
  const { mode } = useTheme();
  const imgSrc = mode === "dark" && imageDark ? imageDark : image;

  return (
    <li
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-flex-item="base(1of1) p-tablet(1of4)"
    >
      <div data-h2-display="base(flex)" data-h2-flex-direction="base(row)">
        <img src={imgSrc} alt="" />
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

export default InstructionStep;
