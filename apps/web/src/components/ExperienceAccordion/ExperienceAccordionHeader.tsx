import React from "react";

import Accordion from "@gc-digital-talent/ui/src/components/Accordion";
import { AccordionHeaderProps } from "@gc-digital-talent/ui/src/components/Accordion/Accordion";
import { notEmpty } from "@gc-digital-talent/helpers";

export interface ExperienceAccordionHeaderProps extends AccordionHeaderProps {
  category?: React.ReactNode;
  dateRange?: React.ReactNode;
  actions?: React.ReactNode;
}

export const ExperienceAccordionHeader = ({
  category,
  dateRange,
  children,
  actions,
  ...rest
}: ExperienceAccordionHeaderProps) => (
  <Accordion.Header
    data-h2-flex-grow="base(1)"
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(row)"
    data-h2-gap="base(x.5 0)"
    {...rest}
  >
    <Accordion.Trigger>
      <div
        data-h2-flex-grow="base(1)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(row)"
        data-h2-gap="base(x.5 0)"
      >
        <div
          data-h2-flex-grow="base(1)"
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          <span data-h2-display="base(block)" data-h2-font-size="base(h6, 1)">
            {children}
          </span>
          <div
            className="Accordion__Subtitle"
            data-h2-display="base(block)"
            data-h2-font-size="base(copy)"
            data-h2-margin="base(x.25 0 0 0)"
          >
            {category ? (
              <span data-h2-color="base(primary)">{category}</span>
            ) : null}
            {category && dateRange ? (
              <span data-h2-margin="base(0 x.5)" data-h2-color="base(gray.50)">
                |
              </span>
            ) : null}
            {dateRange ? <span>{dateRange}</span> : null}
          </div>
        </div>
      </div>
    </Accordion.Trigger>
    {notEmpty(actions) ? (
      <div
        data-h2-margin="base(x1)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-justify-content="base(center)"
      >
        {actions}
      </div>
    ) : null}
  </Accordion.Header>
);

export default ExperienceAccordionHeader;
