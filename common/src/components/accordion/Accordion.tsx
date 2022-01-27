import React, { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";

export interface AccordionProps {
  title: string;
  subtitle?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  context?: string;
  simple?: boolean;
  defaultOpen?: boolean;
}

interface InternalAccordionProps extends AccordionProps {
  open?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  subtitle,
  simple,
  Icon,
  children,
  defaultOpen,
}) => {
  const contentRef = React.useRef(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const enum border {
    expand = "b(lightpurple, left, solid, m)",
    collapse = "b(darkpurple, left, solid, m)",
    none = "",
  }

  const handleOpen = () => {
    setIsOpen((prev: boolean | undefined) => !prev);
  };
  function getStyle(): border {
    if (simple) return border.none;
    if (isOpen) return border.expand;
    return border.collapse;
  }

  return (
    <div
      data-h2-margin="b(top, xxs)"
      data-h2-shadow="b(m)"
      data-h2-radius="b(none, s, s, none)"
      data-h2-overflow="b(all, hidden)"
      data-h2-border="b([light]primary, left, solid, m)"
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
        }}
      >
        <div data-h2-flex-grid="b(middle, expanded, flush, s)">
          <span>
            {isOpen ? (
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
            {!simple && (
              <span className="icon" data-h2-text-align="b(left)">
                {Icon && <Icon height="20px" width="20px" />}
              </span>
            )}
          </div>
        </div>
      </button>
      <div ref={contentRef} data-h2-border={`${getStyle()}`} id="content">
        {isOpen && (
          <div data-h2-padding="b(top, none) b(right, l) b(bottom, m) b(left, l)">
            <hr data-h2-margin="b(top, none) b(bottom, s, b(left, l)" />
            <p data-h2-margin="b(all, none)">{children} </p>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
