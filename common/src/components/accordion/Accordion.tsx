import React, { useState } from "react";
import { Section as InternalSection, ExternalSectionProps } from "./Section";
import "./Accordion.css";

interface AccordionProps {
  defaultOpenIndex?: number;
}
export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpenIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(defaultOpenIndex);
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
          heading={JSXProps.heading}
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
