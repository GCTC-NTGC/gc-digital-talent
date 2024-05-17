import ArrowRightCircleIcon from "@heroicons/react/24/solid/ArrowRightCircleIcon";
import ArrowDownCircleIcon from "@heroicons/react/24/solid/ArrowDownCircleIcon";
import { ReactNode } from "react";

import { useTheme } from "@gc-digital-talent/theme";

export interface InstructionStepProps {
  image: string;
  imageDark?: string;
  includeArrow?: boolean;
  children: ReactNode;
}

export const InstructionStep = ({
  image,
  imageDark,
  includeArrow = true,
  children,
}: InstructionStepProps) => {
  const { mode } = useTheme();
  const imgSrc = mode === "dark" && imageDark ? imageDark : image;

  return (
    <li className="flex flex-col">
      <div className="flex flex-row">
        <img src={imgSrc} alt="" />
        {includeArrow && (
          <ArrowRightCircleIcon
            className="hidden h-auto w-10 overflow-visible px-1.5 align-middle sm:block"
            data-h2-color="base:all(black.lighter)"
          />
        )}
      </div>
      <div className="mt-3 flex-1 flex-grow pl-4 -indent-4">{children}</div>
      {includeArrow && (
        <ArrowDownCircleIcon
          className="m-auto block h-auto w-10 py-3 sm:hidden"
          data-h2-color="base:all(black.lighter)"
        />
      )}
    </li>
  );
};
