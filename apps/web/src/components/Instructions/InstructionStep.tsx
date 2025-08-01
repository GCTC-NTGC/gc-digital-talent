import ArrowRightCircleIcon from "@heroicons/react/24/solid/ArrowRightCircleIcon";
import ArrowDownCircleIcon from "@heroicons/react/24/solid/ArrowDownCircleIcon";
import { ReactNode } from "react";

import { useTheme } from "@gc-digital-talent/theme";
import { Image } from "@gc-digital-talent/ui";

interface InstructionStepProps {
  img: {
    src: string;
    darkSrc?: string;
    lazy?: boolean;
    width?: number;
    height?: number;
  };
  includeArrow?: boolean;
  children: ReactNode;
}

const InstructionStep = ({
  img: { src, darkSrc, lazy, ...imgProps },
  includeArrow = true,
  children,
}: InstructionStepProps) => {
  const { mode } = useTheme();
  const imgSrc = mode === "dark" && darkSrc ? darkSrc : src;

  return (
    <li className="flex flex-col">
      <div className="flex">
        <Image {...imgProps} src={imgSrc} alt="" />
        {includeArrow ? (
          <ArrowRightCircleIcon className="hidden h-auto w-9 overflow-visible px-1.5 align-middle text-gray xs:block" />
        ) : (
          <span aria-hidden="true" className="hidden w-9 px-1.5 xs:block" />
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
