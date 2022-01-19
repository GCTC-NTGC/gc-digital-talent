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
    <><div
      data-h2-shadow="b(m)"
      data-h2-radius="b(none, s, s, none)"
      data-h2-overflow="b(all, hidden)"
    >
      <button
        type="button"
        data-h2-text-align="b(left)"
        data-h2-bg-color="b(white)"
        data-h2-padding="b(top-bottom, s) b(right, m) b(left, s)"
        data-h2-width="b(100)"
        onClick={() => setActiveIndex(index)}
        data-h2-border="b(darkpurple, left, solid, m)"
        style={{borderTop:"none", borderRight:"none", borderBottom:"none"}}
        >

      <div data-h2-flex-grid="b(middle, expanded, flush, s)">
        <span>
          {isActive ? (
            <ChevronDownIcon height="20" />
          ) : (
            <ChevronRightIcon height="20" />
          )}
        </span>
        <div data-h2-flex-item="b(auto)" data-h2-text-align="b(left)">
          <p data-h2-margin="b(all, none)" data-h2-font-size="b(h5)">
            {title}
          </p>
          <p data-h2-margin="b(top, xxs) b(bottom, none)">{subtitle}</p>
        </div>
        <div data-h2-flex-item="b(content)">
          <span className="icon" data-h2-text-align="b(left)">
            {Icon && <Icon height="20px" width="20px" />}
          </span>
        </div>
      </div>
    </button><div
      className={contentClass}
      ref={contentRef}
      data-h2-border="b(lightpurple, left, solid, m)"
      id="content"
    >
        {isActive && children}
      </div></>
    </div>
  );
};
