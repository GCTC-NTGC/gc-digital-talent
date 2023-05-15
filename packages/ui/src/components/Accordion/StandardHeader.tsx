import React from "react";

import Accordion, { AccordionHeaderProps } from "./Accordion";
import { IconType } from "../../types";

type TitleProps = React.HTMLAttributes<HTMLSpanElement> & {
  [data: string]: string;
};
export interface StandardHeaderProps extends AccordionHeaderProps {
  Icon?: IconType;
  context?: React.ReactNode;
  subtitle?: React.ReactNode;
  titleProps?: TitleProps;
  subtitleProps?: TitleProps;
}

export const StandardHeader = ({
  Icon,
  context,
  subtitle,
  children,
  titleProps,
  subtitleProps,
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
            data-h2-color="base(black) base:hover(primary)"
            data-h2-display="base(block)"
            data-h2-font-size="base(h6, 1)"
            data-h2-font-weight="base(700)"
            data-h2-text-decoration="base(underline)"
            {...titleProps}
          >
            {children}
          </span>
          {subtitle && (
            <span
              className="Accordion__Subtitle"
              data-h2-display="base(block)"
              data-h2-font-size="base(copy)"
              data-h2-margin="base(x.25, 0, 0, 0)"
              {...subtitleProps}
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
                data-h2-margin="base(x.125, x.75, 0, 0)"
              />
            </span>
          )}
        </div>
      </Accordion.Trigger>
    </Accordion.Header>
  );
};

export default StandardHeader;
