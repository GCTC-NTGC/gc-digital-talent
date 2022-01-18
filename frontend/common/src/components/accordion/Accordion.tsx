import React, { useState } from "react";
import { Section as InternalSection, ExternalSectionProps } from "./Section";
import "../../css/Accordion.css";

interface AccordionProps {
  defaultOpenIndex?: any;
}
export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpenIndex,
}) => {
  const [activeIndex, setActiveIndex] = useState<unknown>(defaultOpenIndex);
  const sectionsWithInjectedProps = React.Children.map(
    children,
    (child, index) => {
      if (
        !React.isValidElement(child) ||
        typeof child.type !== "function" ||
        child.type.name !== InternalSection.name
      ) {
        return false;
      }
      const JSXProps: ExternalSectionProps = child.props;
      const isActive = index === activeIndex;
      return (
        <InternalSection
          index={index}
          isActive={isActive}
          setActiveIndex={setActiveIndex}
          title={JSXProps.title}
          subtitle={JSXProps.subtitle}
          icon={JSXProps.icon}
        >
          {React.cloneElement(child)}
        </InternalSection>
      );
    },
  );
  return <div className="accordion">{sectionsWithInjectedProps}</div>;
};

export const Section: React.FC<ExternalSectionProps> = ({ children }) => (
  <> {children} </>
);

export default Accordion;
