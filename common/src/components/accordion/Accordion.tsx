import React from "react";
import { Section as InternalSection, ExternalSectionProps } from "./Section";
import "../../css/Accordion.css";

export interface AccordionProps {
  defaultOpen?: boolean;
}
export const Accordion: React.FC<AccordionProps> = ({ children }) => {
  const sectionsWithInjectedProps = React.Children.map(children, (child) => {
    if (
      !React.isValidElement(child) ||
      typeof child.type !== "function" ||
      child.type.name !== InternalSection.name
    ) {
      return false;
    }
    const JSXProps: ExternalSectionProps = child.props;
    return (
      <InternalSection
        title={JSXProps.title}
        subtitle={JSXProps.subtitle}
        Icon={JSXProps.Icon}
        simple={JSXProps.simple}
      >
        {React.cloneElement(child)}
      </InternalSection>
    );
  });
  return <div className="accordion">{sectionsWithInjectedProps}</div>;
};

export const Section: React.FC<ExternalSectionProps> = ({ children }) => (
  <> {children} </>
);

export default Accordion;
