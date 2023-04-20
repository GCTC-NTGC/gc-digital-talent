import { Accordion } from "@gc-digital-talent/ui";
import { AccordionTriggerProps } from "@gc-digital-talent/ui/src/components/Accordion/Accordion";
import React from "react";

export interface ExperienceAccordionTriggerProps extends AccordionTriggerProps {
  subtitle?: React.ReactNode;
}

export const ExperienceAccordionTrigger = ({
  subtitle,
  children,
  ...rest
}: ExperienceAccordionTriggerProps) => {
  return (
    <Accordion.Trigger {...rest}>
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
    </Accordion.Trigger>
  );
};

export default ExperienceAccordionTrigger;
