import ArrowRightCircleIcon from "@heroicons/react/24/solid/ArrowRightCircleIcon";
import ArrowDownCircleIcon from "@heroicons/react/24/solid/ArrowDownCircleIcon";
import { ReactNode, Children } from "react";

import { useTheme } from "@gc-digital-talent/theme";
import { Image, Card } from "@gc-digital-talent/ui";

interface InstructionsStepCardProps {
  img: {
    src: string;
    darkSrc?: string;
    lazy?: boolean;
    width?: number;
    height?: number;
  };
  includeArrow?: boolean;
  children: ReactNode;
  className?: string;
}

const InstructionsStepCard = ({
  img: { src, darkSrc, lazy, ...imgProps },
  includeArrow = true,
  children,
  className = "",
}: InstructionsStepCardProps) => {
  const { mode } = useTheme();
  const imgSrc = mode === "dark" && darkSrc ? darkSrc : src;

  return (
    <div className="h-full rounded-md shadow-xl">
      <Card
        className={`h-full shadow-none ${className} rounded-none text-center`}
      >
        <div className="mb-4 flex justify-center">
          <Image {...imgProps} src={imgSrc} alt="" />
        </div>
        <div>{children}</div>

        {/* Mobile arrow */}
        {includeArrow && (
          <div className="mt-6 block xs:hidden">
            <ArrowDownCircleIcon className="mx-auto h-8 w-8 text-gray" />
          </div>
        )}
      </Card>
    </div>
  );
};

interface InstructionsCardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const InstructionsCardGrid = ({
  children,
}: InstructionsCardGridProps) => {
  const childrenArray = Children.toArray(children);
  const totalCards = childrenArray.length;

  return (
    <div className="relative">
      <div className="hidden xs:flex">
        {childrenArray.map((child, index) => (
          <div key={index} className="relative flex-1">
            {child}
            {index < totalCards - 1 && (
              <div className="absolute top-1/2 -right-4 z-10 -translate-y-1/2">
                <ArrowRightCircleIcon className="h-8 w-8 text-gray" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile layout */}
      <div className="block space-y-6 xs:hidden">
        {childrenArray.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    </div>
  );
};

export default InstructionsStepCard;
