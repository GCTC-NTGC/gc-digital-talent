import React, { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";

export interface AccordionProps {
  title: string;
  subtitle?: string | React.ReactNode;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  context?: string;
  simple?: boolean;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({
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
      data-h2-margin="b(x.25, auto, auto, auto)"
      data-h2-shadow="b(m)"
      data-h2-radius="b(0px, s, s, 0px)"
      data-h2-overflow="b(hidden, all)"
      data-h2-border="b(left, .5rem, solid, light.dt-primary)"
      className="accordion"
      {...rest}
    >
      <button
        type="button"
        data-h2-text-align="b(left)"
        data-h2-background-color="b(dt-white)"
        data-h2-padding="b(x.5, x1, x.5, x.5)"
        data-h2-width="b(100%)"
        onClick={() => handleOpen()}
        {...(isOpen && children
          ? { "data-h2-border": "b(left, .5rem, solid, light.dt-primary)" }
          : { "data-h2-border": "b(left, .5rem, solid, dark.dt-primary)" })}
        style={{
          borderTop: "none",
          borderRight: "none",
          borderBottom: "none",
          borderLeft: simple ? "none" : "",
          cursor: "pointer",
        }}
        aria-expanded={isOpen}
        className="accordion-header"
      >
        <div
          data-h2-flex-grid="b(center, 0, x.5)"
          data-h2-flex-wrap="b(nowrap)"
          className="accordion-header-wrapper"
        >
          <span>
            {isOpen ? (
              <ChevronDownIcon style={{ width: "1.5rem" }} />
            ) : (
              <ChevronRightIcon style={{ width: "1.5rem" }} />
            )}
          </span>
          <div data-h2-flex-item="b(fill)" data-h2-text-align="b(left)">
            <p
              data-h2-margin="b(0)"
              data-h2-font-size="b(h5, 1.3)"
              data-h2-color="b(dt-black)"
            >
              {title}
            </p>

            <p data-h2-margin="b(x.5, auto, 0, auto)">{subtitle}</p>
          </div>
          <div
            data-h2-flex-item="b(content)"
            data-h2-display="b(flex)"
            data-h2-align-items="b(center)"
            data-h2-flex-direction="b(row)"
            style={{ flexShrink: 0 }}
            className="accordion-header-context"
          >
            <p data-h2-font-size="b(copy)">{context}</p>
            {!simple && (
              <span className="icon" data-h2-margin="b(auto, auto, auto, x.25)">
                {Icon && <Icon style={{ width: "1.5rem", height: "1.5rem" }} />}
              </span>
            )}
          </div>
        </div>
      </button>
      <div
        {...(!simple &&
          (isOpen
            ? { "data-h2-border": "b(left, .5rem, solid, light.dt-primary)" }
            : { "data-h2-border": "b(left, .5rem, solid, dark.dt-primary)" }))}
        id="content"
        data-h2-background-color="b(dt-white)"
      >
        <div
          data-h2-padding="b(0, x2, x1, x2)"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <hr data-h2-margin="b(0, auto, x1, x2)" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
