import React from "react";
import clsx from "clsx";

export interface ExternalSectionProps {
  heading: string;
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
  heading,
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
    <div className={sectionClass}>
      <button type="button" onClick={() => setActiveIndex(index)}>
        {heading}
      </button>
      <div className={contentClass} ref={contentRef}>
        {isActive && children}
      </div>
    </div>
  );
};
