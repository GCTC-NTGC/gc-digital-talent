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
    <li className="flex flex-col">
      <div className="flex">
        <img src={imgSrc} alt="" />
        {includeArrow && (
          <ArrowRightCircleIcon className="hidden h-auto w-9 overflow-visible px-1.5 align-middle text-gray xs:block" />
        )}
      </div>
      <div className="mt-3 grow pl-4 -indent-4">{children}</div>
      {includeArrow && (
        <ArrowDownCircleIcon className="m-auto block h-auto w-9 overflow-visible py-3 text-gray xs:hidden" />
      )}
    </li>
  );
};

export default InstructionStep;
