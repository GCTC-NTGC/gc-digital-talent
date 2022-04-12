import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";

export interface AccordionProps {
  title: string;
  subtitle?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  context?: string;
  simple?: boolean;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  subtitle,
  context,
  simple,
  Icon,
  children,
  defaultOpen,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleOpen = () => {
    setIsOpen((prev: boolean | undefined) => !prev);
  };

  return (
    <div
      data-h2-margin="b(top, xxs)"
      data-h2-shadow="b(m)"
      data-h2-radius="b(none, s, s, none)"
      data-h2-overflow="b(all, hidden)"
      data-h2-border="b([light]primary, left, solid, m)"
      {...rest}
    >
      <button
        type="button"
        data-h2-text-align="b(left)"
        data-h2-bg-color="b(white)"
        data-h2-padding="b(top-bottom, s) b(right, m) b(left, s)"
        data-h2-width="b(100)"
        onClick={() => handleOpen()}
        {...(isOpen && children
          ? { "data-h2-border": "b(lightpurple, left, solid, m)" }
          : { "data-h2-border": "b(darkpurple, left, solid, m)" })}
        style={{
          borderTop: "none",
          borderRight: "none",
          borderBottom: "none",
          borderLeft: simple ? "none" : "",
          cursor: "pointer",
        }}
        aria-expanded={isOpen}
      >
        <div data-h2-flex-grid="b(middle, expanded, flush, s)">
          <span>
            {isOpen ? (
              <ChevronDownIcon height="1.5rem" />
            ) : (
              <ChevronRightIcon height="1.5rem" />
            )}
          </span>
          <div data-h2-flex-item="b(auto)" data-h2-text-align="b(left)">
            <p
              data-h2-margin="b(all, none)"
              data-h2-font-size="b(h5)"
              data-h2-font-color="b(black)"
            >
              {title}
            </p>

            <p data-h2-margin="b(top, xxs) b(bottom, none)">{subtitle}</p>
          </div>
          <div data-h2-flex-item="b(content)" data-h2-text-align="b(right)">
            <p
              data-h2-text-align="b(right)"
              data-h2-font-size="b(normal)"
              data-h2-font-color="b(lightpurple)"
            >
              {context}
            </p>
          </div>
          <div data-h2-flex-item="b(content)">
            {!simple && (
              <span className="icon" data-h2-text-align="b(left)">
                {Icon && <Icon height="1.5rem" width="1.5rem" />}
              </span>
            )}
          </div>
        </div>
      </button>
      <div
        {...(!simple &&
          (isOpen
            ? { "data-h2-border": "b(lightpurple, left, solid, m)" }
            : { "data-h2-border": "b(darkpurple, left, solid, m)" }))}
        id="content"
        data-h2-bg-color="b(white)"
      >
        <div
          data-h2-padding="b(top, none) b(right, l) b(bottom, m) b(left, l)"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <hr data-h2-margin="b(top, none) b(bottom, m, b(left, l))" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
