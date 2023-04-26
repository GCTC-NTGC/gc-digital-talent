import { Accordion } from "@gc-digital-talent/ui";
import { AccordionHeaderProps } from "@gc-digital-talent/ui/src/components/Accordion/Accordion";
import React from "react";

export interface StandardHeaderProps extends AccordionHeaderProps {
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  context?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const StandardHeader = ({
  Icon,
  context,
  subtitle,
  children,
  ...rest
}: StandardHeaderProps) => {
  return (
    <Accordion.Header {...rest}>
      <Accordion.Trigger>
        <div
          data-h2-flex-grow="base(1)"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          <span
            data-h2-display="base(block)"
            data-h2-font-size="base(h6, 1)"
            data-h2-font-weight="base(700)"
          >
            {children}
          </span>
          {subtitle && (
            <span
              className="Accordion__Subtitle"
              data-h2-display="base(block)"
              data-h2-font-size="base(copy)"
              data-h2-margin="base(x.25, 0, 0, 0)"
            >
              {subtitle}
            </span>
          )}
        </div>
        <div
          className="accordion-header-context"
          data-h2-align-items="base(center)"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(row)"
          style={{ flexShrink: 0 }}
        >
          {context && <p data-h2-font-size="base(copy)">{context}</p>}
          {Icon && (
            <span className="icon" data-h2-margin="base(0, 0, 0, x1)">
              <Icon
                data-h2-width="base(x1.2)"
                data-h2-margin="base(x.125, x1, 0, 0)"
              />
            </span>
          )}
        </div>
      </Accordion.Trigger>
    </Accordion.Header>
  );
};

export default StandardHeader;
