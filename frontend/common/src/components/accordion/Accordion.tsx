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
      data-h2-margin="base(x.25, 0, 0, 0)"
      data-h2-shadow="base(l)"
      data-h2-radius="base(0px, s, s, 0px)"
      data-h2-overflow="base(hidden, all)"
      className="accordion"
      {...rest}
    >
      <button
        type="button"
        data-h2-text-align="base(left)"
        data-h2-background-color="base(dt-white)"
        data-h2-padding="base(x1, x1, x1, x.5)"
        data-h2-width="base(100%)"
        onClick={() => handleOpen()}
        {...(isOpen && children
          ? {
              "data-h2-border":
                "base(top-bottom, 0px, solid, transparent) base(right, 0px, solid, transparent) base(left, x.5, solid, light.dt-primary)",
            }
          : {
              "data-h2-border":
                "base(top-bottom, 0px, solid, transparent) base(right, 0px, solid, transparent) base(left, x.5, solid, dark.dt-primary)",
            })}
        style={{
          cursor: "pointer",
        }}
        aria-expanded={isOpen}
        className="accordion-header"
      >
        <div
          data-h2-flex-grid="base(center, 0, x.5)"
          className="accordion-header-wrapper"
        >
          <div data-h2-flex-item="base(content)">
            {isOpen ? (
              <ChevronDownIcon data-h2-width="base(x1.5)" />
            ) : (
              <ChevronRightIcon data-h2-width="base(x1.5)" />
            )}
          </div>
          <div data-h2-flex-item="base(fill)" data-h2-text-align="base(left)">
            <div data-h2-flex-grid="base(center, 0, x.5)">
              <div data-h2-flex-item="base(1of1) p-tablet(fill)">
                <p
                  data-h2-font-size="base(h6, 1)"
                  data-h2-font-weight="base(700)"
                >
                  {title}
                </p>
                {subtitle ? (
                  <p data-h2-margin="base(x.25, 0, 0, 0)">{subtitle}</p>
                ) : (
                  ""
                )}
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(content)">
                <div
                  data-h2-flex-item="base(content)"
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(center)"
                  data-h2-flex-direction="base(row)"
                  style={{ flexShrink: 0 }}
                  className="accordion-header-context"
                >
                  <p data-h2-font-size="base(copy)">{context}</p>
                  {!simple && (
                    <span className="icon" data-h2-margin="base(0, 0, 0, x1)">
                      {Icon && (
                        <Icon
                          data-h2-width="base(x1.2)"
                          data-h2-margin="base(x.125, 0, 0, 0)"
                        />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
      <div
        {...(!simple &&
          (isOpen
            ? { "data-h2-border": "base(left, x.5, solid, light.dt-primary)" }
            : { "data-h2-border": "base(left, x.5, solid, dark.dt-primary)" }))}
        id="content"
        data-h2-background-color="base(dt-white)"
      >
        <div
          data-h2-padding="base(0, x1, x1, x2.5)"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <hr
            data-h2-background-color="base(dt-gray)"
            data-h2-height="base(1px)"
            data-h2-width="base(100%)"
            data-h2-border="base(none)"
            data-h2-margin="base(0, 0, x1, 0)"
          />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
