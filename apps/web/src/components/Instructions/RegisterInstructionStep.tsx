import ArrowRightCircleIcon from "@heroicons/react/24/solid/ArrowRightCircleIcon";
import ArrowDownCircleIcon from "@heroicons/react/24/solid/ArrowDownCircleIcon";
import type { ReactNode } from "react";
import { Children } from "react";
import { tv } from "tailwind-variants";

import { useTheme } from "@gc-digital-talent/theme";
import { Image, Card } from "@gc-digital-talent/ui";

interface InstructionsStepCardProps {
  img: {
    src: string;
    darkSrc?: string;
    lazy?: boolean;
    width?: number;
    height?: number;
    sources?: {
      xxs?: string;
      xs?: string;
    };
    darkSources?: {
      xxs?: string;
      xs?: string;
    };
    className?: string;
  };
  includeArrow?: boolean;
  children: ReactNode;
  className?: string;
  background?: "default" | "darker";
}

const instructionStepCard = tv({
  base: "h-full text-center",
  variants: {
    background: {
      default: "bg-transparent",
      darker: "bg-gray-100/30 dark:bg-gray-700/50",
    },
  },
  defaultVariants: {
    background: "default",
  },
});

const InstructionsStepCard = ({
  img: {
    src,
    darkSrc,
    sources,
    darkSources,
    lazy,
    width,
    height,
    className: imgClassName,
    ...imgProps
  },
  children,
  className = "",
  background = "default",
}: InstructionsStepCardProps) => {
  const { mode } = useTheme();
  const imgSrc = mode === "dark" && darkSrc ? darkSrc : src;
  const imgSources = mode === "dark" && darkSources ? darkSources : sources;

  return (
    <Card
      shadow={false}
      className={instructionStepCard({
        class: [className],
        background,
      })}
    >
      <div className="mb-4 flex justify-center">
        <Image
          {...imgProps}
          src={imgSrc}
          sources={imgSources}
          alt=""
          width={width}
          height={height}
          loading={lazy ? "lazy" : "eager"}
          className={imgClassName}
        />
      </div>
      <div>{children}</div>
    </Card>
  );
};

interface InstructionsCardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  className?: string;
}

export const InstructionsCardGrid = ({
  children,
  columns = 3,
}: InstructionsCardGridProps) => {
  const childrenArray = Children.toArray(children);
  const totalCards = childrenArray.length;
  const sixCardsGrid = columns === 6;

  return (
    <div className="overflow-hidden rounded-md bg-white shadow-xl dark:bg-gray-600">
      <div className="relative">
        <div className="hidden shadow-xl xs:block">
          {sixCardsGrid ? (
            <ol className="grid grid-cols-3">
              {childrenArray.slice(0, 6).map((child, index) => (
                <li key={index} className="relative">
                  {child}
                  {index % 3 !== 2 && (
                    <div className="absolute top-1/2 -right-4 z-10 -translate-y-1/2">
                      <ArrowRightCircleIcon className="h-8 w-8 overflow-visible align-middle text-gray" />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            /* default row */
            <ol className="flex">
              {childrenArray.map((child, index) => (
                <li key={index} className="relative flex-1">
                  {child}
                  {index < totalCards - 1 && (
                    <div className="absolute top-1/2 -right-4 z-10 -translate-y-1/2">
                      <ArrowRightCircleIcon className="h-8 w-8 overflow-visible align-middle text-gray" />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Mobile */}
        <div className="block shadow-xl xs:hidden">
          <ol>
            {childrenArray.map((child, index) => (
              <li key={index} className="relative">
                <div className="h-full">{child}</div>
                {index < totalCards - 1 && (
                  <div className="pointer-events-none absolute -bottom-6 left-1/2 z-10 -translate-x-1/2">
                    <ArrowDownCircleIcon className="mb-2 h-8 w-8 text-gray" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default InstructionsStepCard;
