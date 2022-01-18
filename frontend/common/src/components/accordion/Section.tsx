import React from "react";
import clsx from "clsx";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";

export interface ExternalSectionProps {
  title: string;
  subtitle?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface InternalSectionProps extends ExternalSectionProps {
  index: number;
  isActive: boolean;
  setActiveIndex(index: number): void;
}

export const Section: React.FC<InternalSectionProps> = ({
  index,
  isActive,
  setActiveIndex,
  title,
  subtitle,
  Icon,
  children,
}) => {
  const sectionClass = clsx(
    "accordion-section",
    isActive && "accordion-section--active",
  );
  const contentRef = React.useRef(null);
  const contentClass = clsx(
    "accordion-section__content",
    isActive && "accordion-section__content--active",
  );
  return (
    <div
      className={sectionClass}
      data-h2-border="b(darkpurple, left, solid, m)"
    >
      <button
        type="button"
        data-h2-text-align="b(left)"
        onClick={() => setActiveIndex(index)}
      >
        <div className="header">
          <span>
            {isActive ? (
              <ChevronDownIcon height="20" />
            ) : (
              <ChevronRightIcon height="20" />
            )}
          </span>
          <span
            className="title"
            data-h2-font-family="b(sans)"
            data-h2-font-size="b(h5)"
          >
            {title}
          </span>
          <span className="icon" data-h2-text-align="b(left)">
            {Icon && <Icon height="20px" width="20px" />}
          </span>
          <div>
            <span data-h2-font-family="b(sans)" data-h2-font-size="b(normal)">
              {subtitle}
            </span>
          </div>
        </div>
      </button>
      <div className={contentClass} ref={contentRef}>
        {isActive && children}
      </div>
    </div>
  );
};
